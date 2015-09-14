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

Command-line usage:

```
:~/mdmanifest⭐  ./mdm.js manifest ./test/valid-example.md 
{
  "ping": "async",
  "listen": "source"
}

:~/mdmanifest⭐  ./mdm.js html ./test/valid-example.md 
<h1>example-api</h1>
<p>Example API, v1.0.0.</p>
<p>This is an example API, written by Paul Frazee.
It&apos;s not a real API, but it would work with muxrpc.</p>
<h2>ping: async</h2>
<p>Pings a target machine.</p>
<p>ping {target string} [-n number]</p>
<ul>
<li>target: string, an IPv4/IPv6 address</li>
<li>
<p>opts:</p>
<ul>
<li>n: optional number, how many times to ping</li>
</ul>
</li>
</ul>
<p>Sends ICMP ping messages to the given target.
Will wait 1 second between pings.</p>
<h2>listen: source</h2>
<p>Listens for pings.</p>
<p>Will emit a string describing incoming pings, as they occur.</p>

:~/mdmanifest⭐  ./mdm.js usage ./test/valid-example.md 
Example API, v1.0.0.

This is an example API, written by Paul Frazee.
It's not a real API, but it would work with muxrpc.

Commands:
  ping Pings a target machine.
  listen Listens for pings.

:~/mdmanifest⭐  ./mdm.js usage ./test/valid-example.md ping
Pings a target machine.

ping {target string} [-n number]

-   target: string, an IPv4/IPv6 address
-   opts:
    -   n: optional number, how many times to ping

Sends ICMP ping messages to the given target.
Will wait 1 second between pings.
```