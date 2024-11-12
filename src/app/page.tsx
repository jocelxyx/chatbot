"use client";

import { constants } from "crypto";
import { useState, useEffect, FormEvent } from "react";
import axios from 'axios';

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (prompt.trim() === "") return;

    const newMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, newMessage]);

    const body = { message: prompt };
    const fetchResponse = async() => {
      const response = await axios.post("/api/prompt", body);
      const placeholderResponse: Message = {
        role: "assistant",
        content: response.data.message,
      };
      setMessages((prev) => [...prev, placeholderResponse]);
    };

    fetchResponse();

    setPrompt("");
  };
    
  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Chat with Buba</h1>
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-[500px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.role === "user"
                    ? "bg-pink-300 text-white"
                    : "bg-gray-200 text-gray-800"
                } p-3 rounded-lg max-w-xs`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-pink-300 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition-colors"
          >
            Send
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
}
