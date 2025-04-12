import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursors/LiveCursors";
import { useOthers } from "@/liveblocks.config";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
} from "@liveblocks/react";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import CursorChat from "./cursors/CursorChat";
import ReactionSelector from "./reaction/ReactionButton";
import useInterval from "@/hooks/useInterval";
import FlyingReaction from "./reaction/FlyingReaction";

type LiveProp = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function Live({ canvasRef }: LiveProp) {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const broadcast = useBroadcastEvent();
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const [reactions, setReactions] = useState<Reaction[]>([]);
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 100);
  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({ cursor: { x, y } });
      }
    },
    []
  );
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });
      setCursorState((state) =>
        state.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
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
      if (event.key == "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (event.key == "e") {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        });
      }
    };
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  return (
    <div
    className="relative flex h-full w-full flex-1 items-center justify-center"
        id="canvas"
        style={{
          cursor: cursorState.mode === CursorMode.Chat ? "none" : "auto",
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <canvas ref={canvasRef} />

        {/* Render the reactions */}
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {/* If cursor is in chat mode, show the chat cursor */}
        {cursor && (
          <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {/* If cursor is in reaction selector mode, show the reaction selector */}
        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector
            setReaction={(reaction) => {
              setCursorState({
                mode: CursorMode.Reaction,
                reaction,
                isPressed: false,
              });
            }}
          />
        )}

        {/* Show the live cursors of other users */}
        <LiveCursors others={others} />

    </div>
  );
}