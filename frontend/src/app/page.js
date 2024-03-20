"use client";
import React, { useState, useEffect, useRef } from "react";
import { getPromptResponse } from "../../api/getPromptResponse";
import { ChatResponse, ChatPrompt, TextArea } from "../components/chat";

const agentTypes = {
  user: "User",
  richieRich: "RichieRich",
};

export default function Home() {
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const wsRef = useRef(null);

  const handleTextAreaChange = (event) => {
    setPrompt(event.target.value);
  };

  const addMessage = (message, agent) => {
    setMessages((prev) => [
      ...prev,
      {
        agent,
        contents: message,
      },
    ]);
  };

  const handleSubmit = () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setError(null);
    setIsLoadingResponse(true);
    addMessage(prompt, agentTypes.user); // Add the user's prompt to the messages

    // Close any existing WebSocket connection
    if (wsRef.current) {
      wsRef.current();
    }

    wsRef.current = getPromptResponse(prompt, (data, isComplete) => {
      if (data !== null && !isComplete) {
        // For continuous data from RichieRich, append it to the last message if it's also from RichieRich
        setMessages((prevMessages) => {
          const lastMessage = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1] : null;
          if (lastMessage && lastMessage.agent === agentTypes.richieRich) {
            return [...prevMessages.slice(0, -1), { ...lastMessage, contents: lastMessage.contents + data }];
          } else {
            return [...prevMessages, { agent: agentTypes.richieRich, contents: data }];
          }
        });
      }
      if (isComplete) {
        setIsLoadingResponse(false);
        setPrompt("");
      }
    });
  };

  useEffect(() => {
    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    // Cleanup WebSocket connection on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current(); // Call the cleanup function
      }
    };
  }, []);

  return (
    <main className="flex flex-col items-center w-full bg-gray-100 h-[93vh]">
      <div
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-scroll p-20 w-full mb-40"
      >
        {messages.map((message, index) =>
          message.agent === agentTypes.user ? (
            <ChatPrompt key={index} prompt={message.contents} />
          ) : (
            <ChatResponse key={index} response={message.contents} />
          ),
        )}
      </div>
      <TextArea
        onChange={handleTextAreaChange}
        onSubmit={handleSubmit}
        isLoading={isLoadingResponse}
        hasError={error !== null}
        value={prompt}
      />
      {error && (
        <div className="absolute bottom-0 mb-2 text-red-500">{error}</div>
      )}
    </main>
  );
}
