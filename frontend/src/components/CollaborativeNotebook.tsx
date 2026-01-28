"use client";
import { useState } from "react";

export default function CollaborativeNotebook() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full h-64 bg-white border rounded-lg p-4 shadow flex flex-col">
      <div className="font-bold text-blue-700 mb-2">Collaborative Notebook</div>
      <textarea
        className="flex-1 w-full border rounded-lg p-2 text-gray-700 bg-blue-50 focus:outline-none focus:border-blue-400 resize-none"
        placeholder="Type your notes here... (real-time coming soon)"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}
