# Markdown Manifest

Uses a regular markdown form to produce muxrpc manifests and cli usage descriptions.

The form:

```markdown
# api-name

Api short description.

Api long, multiline description.
Api long, multiline description.
Api long, multiline description.

## method-name: type

Method short description.

Method long, multiline description.
Method long, multiline description.
Method long, multiline description.
```

Example:

```markdown
# example-api

Example API, v1.0.0.

This is an example API, written by Paul Frazee.
It's not a real API, but it would work with muxrpc.

## ping: async

Pings a target machine.

ping {target string} [-n number]

 - target: string, an IPv4/IPv6 address
 - opts:
   - n: optional number, how many times to ping

Sends ICMP ping messages to the given target.
Will wait 1 second between pings.

## listen: source

Listens for pings.

Will emit a string describing incoming pings, as they occur.
```

The api:

```js
var mdm = require('mdmanifest')

mdm.muxrpcManifest(exampleMd)
/* => {
  ping: 'async',
  listen: 'source'
}*/

mdm.usage(exampleMd)
/* => 
Example API, v1.0.0.

This is an example API, written by Paul Frazee.
It's not a real API, but it would work with muxrpc.

Commands:

 - ping Pings a target machine.
 - listen Listens for pings.
*/

mdm.usage(exampleMd, 'ping')
/* =>
Pings a target machine.

ping {target string} [-n number]

 - target: string, an IPv4/IPv6 address
 - opts:
   - n: optional number, how many times to ping

Sends ICMP ping messages to the given target.
Will wait 1 second between pings.
*/

mdm.html(exampleMd) // standard HTML output
```