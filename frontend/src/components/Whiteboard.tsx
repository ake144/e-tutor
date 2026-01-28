import React, { useRef, useEffect } from "react";

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let drawing = false;
    function start(e: MouseEvent) {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
    function draw(e: MouseEvent) {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    function end() {
      drawing = false;
      ctx.closePath();
    }
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseleave", end);
    };
  }, []);

  return (
    <div className="w-full h-64 bg-gray-50 border rounded-lg p-4 shadow flex flex-col">
      <div className="font-bold text-blue-700 mb-2">Whiteboard</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={180}
        className="w-full h-full bg-white rounded border shadow cursor-crosshair"
      />
      <span className="text-gray-400 text-xs mt-1">(Drawing is local only. Real-time coming soon!)</span>
    </div>
  );
}
