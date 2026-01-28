"use client";
import React, { useState, useRef, useEffect } from "react";
import { getSocket } from "@/lib/socket";

export default function Chat() {
  const [messages, setMessages] = useState<{ text: string; self: boolean }[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.on("chat:message", (msg: string) => {
      setMessages((msgs) => [...msgs, { text: msg, self: false }]);
    });
    return () => {
      socket.off("chat:message");
    };
  }, []);

  function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { text: input, self: true }]);
    socketRef.current?.emit("chat:send", input);
    setInput("");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-64 bg-white border rounded-lg p-4 shadow flex flex-col">
      <div className="font-bold text-blue-700 mb-2">Chat</div>
      <div className="flex-1 overflow-y-auto mb-2 space-y-1 pr-1">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm text-center mt-8">No messages yet.</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-1.5 rounded-lg text-sm mb-1 ${msg.self ? "bg-blue-100 text-blue-800 ml-auto" : "bg-gray-100 text-gray-700"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="flex gap-2" onSubmit={sendMessage}>
        <input
          className="flex-1 border rounded-lg px-2 py-1 text-gray-700 bg-blue-50 focus:outline-none focus:border-blue-400"
          placeholder="Type a message... (real-time enabled)"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
