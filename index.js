var assert = require('assert')
var mdast = require('mdast')
var html = require('mdast-html')

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

var nameRegex = /^[a-z][a-z0-9\.\-_]*$/i
var typeRegex = /^[a-z]+$/i
module.exports.manifest = function (text) {
  assert.equal(typeof text, 'string', 'Input should be a markdown string')

  var manifest = {}
  mdast().parse(text).children.forEach(function (token, i) {
    if (token.type === 'heading' && token.depth === 2) {
      var textToken = token.children[0]
      assert.equal(textToken.type, 'text', 'Headings should not have any markup')

      var parts = textToken.value.split(': ')
      assert.equal(parts.length, 2, 'Heading "'+textToken.value+'" should be of form `method: type`')
      
      var name = parts[0], type = parts[1]
      assert(nameRegex.test(name), 'Function name "'+name+'" does nots match '+nameRegex)
      assert(nameRegex.test(type), 'Function type "'+type+'" does not match '+typeRegex)
      set(manifest, name.split('.'), type)
    }
  })

  return manifest
}

module.exports.usage = function (text, cmd) {
  assert.equal(typeof text, 'string', 'Input should be a markdown string')

}

module.exports.html = function (text) {
  assert.equal(typeof text, 'string', 'Input should be a markdown string')
  return mdast().use(html).process(text)
}