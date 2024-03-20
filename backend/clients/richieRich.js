const WebSocket = require("ws");

function streamRichieRichResponse(prompt, callback) {
  const ws = new WebSocket("ws://localhost:8082/v1/stream");

  ws.on('open', function open() {
    ws.send(prompt);
  });

  ws.on('message', function incoming(data) {
    callback(data);
  });

  ws.on('close', function close() {
    callback(null, true);
  });

  ws.on('error', function error(err) {
    console.error("WebSocket error: ", err);
    callback(null, true);
  });
}

module.exports = { streamRichieRichResponse };
