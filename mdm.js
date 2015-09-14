#! /usr/bin/env node

var minimist = require('minimist')
var wrap = require('word-wrap')
var mdm = require('.')

var parsedArgv = minimist(process.argv.slice(2))
var cmd = parsedArgv._[0]
var file = parsedArgv._[1]
var param = parsedArgv._[2]
var fn = mdm[cmd]

if (!cmd)
  usage('cmd is required')
if (!file)
  usage('file is required')
if (!fn)
  usage('"'+cmd+'" is not a valid cmd')

log(fn(require('fs').readFileSync(file, 'utf-8'), param))

function usage (msg) {
  console.log(msg)
  console.log('Markdown manifest')
  console.log('  mdm manifest {file}')
  console.log('  mdm usage {file}')
  console.log('  mdm usage {file} {method}')
  console.log('  mdm html {file}')
  process.exit(1)
}

function log (v) {
  if (typeof v == 'object')
    console.log(JSON.stringify(v, null, 2))
  else
    console.log(
      v.split('\n').map(function (v) { return wrap(v, { width: process.stdout.columns-5 }) }).join('\n')
    )
}