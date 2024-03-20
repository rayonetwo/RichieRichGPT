const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws')(express());
const { streamRichieRichResponse } = require('./clients/richieRich');

const PORT = 8081;
const app = expressWs.app;

app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    streamRichieRichResponse(msg, (data, isComplete) => {
      if (isComplete) {
        ws.close();
      } else {
        ws.send(data);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
