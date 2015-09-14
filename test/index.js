var tape = require('tape')
var fs   = require('fs')
var mdm  = require('../')

var validExample = fs.readFileSync(__dirname + '/valid-example.md', 'utf-8')
var validExampleToplevelUsage = fs.readFileSync(__dirname + '/valid-example-toplevel-usage.txt', 'utf-8')
var validExamplePingUsage = fs.readFileSync(__dirname + '/valid-example-ping-usage.txt', 'utf-8')
var validExampleListenUsage = fs.readFileSync(__dirname + '/valid-example-listen-usage.txt', 'utf-8')

tape('manifest() simple input', function (t) {
  var manif = mdm.manifest(validExample)
  t.ok(manif)
  t.equal(Object.keys(manif).length, 2)
  t.equal(manif.ping, 'async')
  t.equal(manif.listen, 'source')
  t.end()
})

tape('manifest() sub-objects', function (t) {
  t.equal(mdm.manifest('## foo.bar: sync').foo.bar, 'sync')
  t.equal(mdm.manifest('## foo.bar.baz: sync').foo.bar.baz, 'sync')
  t.end()
})

tape('manifest() throws errors for format mistakes', function (t) {
  t.throws(mdm.manifest.bind(null, '## `foo`'), /AssertionError/)
  t.throws(mdm.manifest.bind(null, '## function'), /AssertionError/)
  t.throws(mdm.manifest.bind(null, '## foo$%bar: baz'), /AssertionError/)
  t.throws(mdm.manifest.bind(null, '## foo bar: baz'), /AssertionError/)
  t.end()
})

tape('usage()', function (t) {
  t.equal(mdm.usage(validExample), validExampleToplevelUsage)
  t.equal(mdm.usage(validExample, 'ping'), validExamplePingUsage)  
  t.equal(mdm.usage(validExample, 'listen'), validExampleListenUsage)  
  t.end()
})