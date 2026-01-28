import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

export function useSocket(event: string, handler: (...args: any[]) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    function internalHandler(...args: any[]) {
      handlerRef.current(...args);
    }
    socket.on(event, internalHandler);
    return () => {
      socket.off(event, internalHandler);
    };
  }, [event]);
}
