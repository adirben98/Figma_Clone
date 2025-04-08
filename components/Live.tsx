import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursors/LiveCursors";
import { useOthers } from "@/liveblocks.config";
import { useMyPresence } from "@liveblocks/react";
import { CursorMode } from "@/types/type";
import CursorChat from "./cursors/CursorChat";

export default function Live() {
  const others = useOthers();
  const [{cursor}, updateMyPresence] = useMyPresence() 
  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden,
  });
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });
    },
    []
  );
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });
    },
    []
  );
  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setCursorState({ mode: CursorMode.Hidden });
      updateMyPresence({ cursor: null });
    },
    []
  );
  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
        if (event.key=='/'){
            setCursorState({
                mode: CursorMode.Chat,
                previousMessage: null,
                message: "",
            })
        }
    }
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    }
  },[])
  return (
    <div
      className="flex justify-center items-center h-[100vh]"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
    >
      <LiveCursors others={others} />
      {cursor && (
          <CursorChat
            cursor={cursor as { x: number; y: number }}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />

      )}
      <h1>Welcome To Figma!</h1>
      
    </div>
  );
}
