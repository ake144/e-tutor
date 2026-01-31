"use client";
import { useState, useRef, useEffect } from "react";
import { getSocket } from "@/lib/socket";

type CollaborativeNotebookProps = {
  sessionId: string;
  user: { email: string } | null;
};

export default function CollaborativeNotebook({ sessionId, user }: CollaborativeNotebookProps) {
  const [value, setValue] = useState("");
  const socketRef = useRef<any>(null);
  const ignoreNext = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.on("notebook:update", (val: string) => {
      ignoreNext.current = true;
      setValue(val);
    });
    return () => {
      socket.off("notebook:update");
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setValue(val);
    if (!ignoreNext.current) {
      socketRef.current?.emit("notebook:update", val);
    }
    ignoreNext.current = false;
  }

  return (
    <div className="w-full h-64 bg-white border rounded-lg p-4 shadow flex flex-col">
      <div className="font-bold text-blue-700 mb-2">Collaborative Notebook</div>
      <textarea
        className="flex-1 w-full border rounded-lg p-2 text-gray-700 bg-blue-50 focus:outline-none focus:border-blue-400 resize-none"
        placeholder="Type your notes here... (real-time enabled)"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
