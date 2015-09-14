# example-api

Example API, v1.0.0.

This is an example API, written by Paul Frazee.
It's not a real API, but it would work with muxrpc.

## ping: async

Pings a target machine.

```bash
ping {target string} [-n number]
```

```js
ping(target, { n: })
```

 - target: string, an IPv4/IPv6 address
 - opts:
   - n: optional number, how many times to ping

Sends ICMP ping messages to the given target.
Will wait 1 second between pings.

## listen: source

Listens for pings.

```bash
listen
```

```js
listen()
```

Will emit a string describing incoming pings, as they occur.