"use client";

import { useState } from "react";
// Add this utility delay function
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Then delay between messages
await sleep(1000); // 1 second delay between requests

export default function ChatApp() {
  const [messages, setMessages] = useState([{ role: "user", content: "" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // Call Bedrock (Claude)
    const res = await fetch("/api/bedrock", {
      method: "POST",
      body: JSON.stringify({ prompt: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    const reply = data.output || data.error || "No response";

    // Add AI message
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  };

  return (
   <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6">
  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[90vh]">
    <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🧠 AI Chat with Claude</h1>

    <div className="flex-1 overflow-y-auto space-y-4 px-2">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-xs px-4 py-2 rounded-xl text-sm leading-relaxed shadow-md ${
              msg.role === "user"
                ? "bg-indigo-200 text-indigo-900"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 flex items-center">
      <input
        className="flex-1 border border-indigo-300 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-r-xl font-semibold transition"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  </div>
</main>

  );
}
