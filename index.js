var assert = require('assert')
var remark = require('remark')
var html = require('remark-html')

// - obj: object
// - path: array, a list of keys
// - value: any
// will create any subobject needed
// eg var x = {}; set(x, ['foo', 'bar'], 5); x.foo.bar == 5
function set (obj, path, value) {
  while (path.length > 1) {
    var k = path.shift()
    if (!obj[k])
      obj[k] = {}
    obj = obj[k]
  }
  obj[path[0]] = value
}

function fill (str, n) {
  if (n > str.length)
    return str + ' '.repeat(n - str.length)
  return str
}

function methodTable (methods, nameWidth) {
  // figure out how long the names column needs to be
  if (!nameWidth) {
    nameWidth = 1
    methods.forEach(function (m) {
      if (m.name.length > nameWidth)
        nameWidth = m.name.length
    })
  }

  return methods.map(function (m) {
    return '  ' + fill(m.name, nameWidth) + ' ' + m.desc
  }).join('').trim()
}

function parseMethodHeading (token, prefix) {
  var textToken = token.children[0]
  assert.equal(textToken.type, 'text', 'Headings should not have any markup')

  var parts = textToken.value.split(': ')
  assert.equal(parts.length, 2, 'Heading "'+textToken.value+'" should be of form `method: type`')
  
  var name = parts[0], type = parts[1]
  assert(nameRegex.test(name), 'Function name "'+name+'" does nots match '+nameRegex)
  assert(nameRegex.test(type), 'Function type "'+type+'" does not match '+typeRegex)

  if (prefix)
    parts[0] = prefix + '.' + parts[0]

  return parts
}

var nameRegex = /^[a-z][a-z0-9\.\-_]*$/i
var typeRegex = /^[a-z]+$/i
module.exports.manifest = function (text) {
  assert.equal(typeof text, 'string', 'Input should be a markdown string')

  var manifest = {}
  remark().parse(text).children.forEach(function (token, i) {
    if (token.type === 'heading' && token.depth === 2) {
      var parts = parseMethodHeading(token)
      set(manifest, parts[0].split('.'), parts[1])
    }
  })

  return manifest
}

module.exports.usage = function (text, cmd, opts) {
  assert.equal(typeof text, 'string', 'Input should be a markdown string')
  opts = opts || {}

  var lexer = remark()
  var tokens = lexer.parse(text).children
  if (!cmd) {
    // toplevel usage
    var inSummary = true // in the api summary?
    var toplevelParas = []
    var methods = []
    var currentMethod
    tokens.forEach(function (token) {
      if (token.type == 'paragraph' && inSummary) {
        // a para in the api's toplevel summary
        toplevelParas.push(lexer.stringify({ type: 'root', children: token.children }))
      } else if (token.type == 'heading' && token.depth == 2) {
        // a method heading
        inSummary = false // no longer in the api summary
        var parts = parseMethodHeading(token, opts.prefix)
        currentMethod = parts[0]
      }
      else if (token.type == 'paragraph' && currentMethod) {
        // the first para in a method
        methods.push({ name: currentMethod, desc: lexer.stringify({ type: 'root', children: token.children })})
        currentMethod = null
      }
    })
    if (currentMethod)
      methods.push({ name: currentMethod })
    return toplevelParas.join('\n') + '\nCommands:\n  ' + methodTable(methods, opts.nameWidth)
  }

  // method usage
  var inMethod = false // in the method?
  var elems = []
  for (var i=0; i < tokens.length; i++) {
    var token = tokens[i]
    if (token.type == 'heading') {
      // a heading
      if (inMethod)
        break // done pulling from the method's summary
      if (token.depth == 2 && parseMethodHeading(token)[0] == cmd)
        inMethod = true // we're in the target method's summary
    }
    else if (inMethod) {
      if (token.type == 'code') {
        // only include code examples for the CLI
        if (token.lang == 'bash' || token.lang == 'sh' || token.lang == 'shell' || !token.lang) {
          token.type = 'text'
          elems.push(token)
        }
      } else
        elems.push(token)
    }
  }
  return lexer
    .stringify({ type: 'root', children: elems })
    .trim()
    .replace(/\\\[/g, '[') // dont escape '['
}

module.exports.html = function (text) {
  assert.equal(typeof text, 'string', 'Input should be a markdown string')
  return remark().use(html).process(text)
}