# BLIP implementation in TypeScript

This is a JavaScript (TypeScript, really) implementation of the [BLIP][BLIP] RPC protocol. It works in a web browser or in node.js / Deno / Bun.

## "What's BLIP?"

![BLIP logo](logo.png)

You can think of BLIP as an extension of [WebSockets][WEBSOCKET] that adds a number of useful features, turning it into more of an RPC protocol:

* **Request/response:** Messages can have responses, and the responses don't have to be sent in the same order as the original messages. Responses are optional; a message can be sent in no-reply mode if it doesn't need one, otherwise a response (even an empty one) will always be sent after the message is handled.
* **Metadata:** Messages are structured, with a set of key/value "properties" and a binary body, much like HTTP or MIME messages. Peers can use the metadata to route incoming messages to different handlers, effectively creating multiple independent channels on the same connection.
* **Multiplexing:** Large messages are broken into fragments called "frames", and if multiple messages are ready to send, their frames will be interleaved on the connection, so they're sent in parallel. This prevents huge messages from blocking the connection.
* **Priorities:** Messages can be marked Urgent, which gives them higher priority in the multiplexing (but without completely starving normal-priority messages.) This is very useful for streaming media.

BLIP is used by Couchbase Mobile's replication protocol. Implementations in [C++][BLIP_CPP] and [Go][BLIP_GO] are also available.

[BLIP]: https://github.com/couchbase/couchbase-lite-core/blob/master/Networking/BLIP/docs/BLIP%20Protocol.md
[BLIP_CPP]: https://github.com/couchbase/couchbase-lite-core/blob/master/Networking/BLIP
[BLIP_GO]: https://github.com/couchbase/go-blip
[WEBSOCKET]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
