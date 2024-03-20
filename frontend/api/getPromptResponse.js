export const getPromptResponse = (prompt, onMessage) => {
  const ws = new WebSocket("ws://localhost:8081");

  ws.onopen = () => {
    ws.send(prompt);
  };

  ws.onmessage = (event) => {
    // Check if the message data is a Blob
    if (event.data instanceof Blob) {
      // Create a FileReader to read the Blob as text
      const reader = new FileReader();
      
      reader.onload = function() {
        // reader.result contains the text representation of the Blob
        const text = reader.result;
        onMessage(text); // Pass the text to the callback for further processing
      };

      reader.onerror = (error) => {
        console.error("Error reading blob:", error);
      };

      // Start reading the content of the Blob
      reader.readAsText(event.data);
    } else {
      // If the message is not a Blob, process it directly
      onMessage(event.data);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    onMessage(null, true); // Indicate that the WebSocket connection has been closed
  };

  return () => ws.close(); // Return a cleanup function to close the WebSocket connection
};
