import { CursorChatProps, CursorMode } from "@/types/type";
import React from "react";

export default function CursorChat({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: event.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: event.target.value,
    });
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCursorState({
        mode: CursorMode.Chat,
        previousMessage: cursorState.message,
        message: "",
      });
    } else if (event.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };
  return (
    <>
      {cursorState.mode === CursorMode.Chat && (
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
          }}
        >
          {cursorState.previousMessage && (
            <div>{cursorState.previousMessage}</div>
          )}

          <div className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]">
            <input
              className="z-10 w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
              autoFocus
              placeholder={
                cursorState.previousMessage ? "" : "Type a message..."
              }
              maxLength={50}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              value={cursorState.message}
              onKeyUp={(event) => {event.stopPropagation()}}
            />
          </div>
        </div>
      )}
    </>
  );
}
