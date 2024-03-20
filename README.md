# RichieRichGPT

## Background

RichieRichGPT provides a ChatGPT-like interface wrapper for a simulated LLM called RichieRich, streaming mock responses. RichieRich outputs rich text in a custom HTML-like markup language called RRML. RichieRich exposes a chat-completion API similar to ChatGPT's.

## Running RichieRichGPT

1. Run the following commands from the `richieRich` directory:

   ```
   $ npm i
   $ node server.js
   ```

   The server will start on port 8082.

2. From the `backend` directory, run:

   ```
   $ npm i
   $ node server.js
   ```

   The server will start on port 8081.

3. From `frontend`:

   ```
   $ npm i
   $ npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
