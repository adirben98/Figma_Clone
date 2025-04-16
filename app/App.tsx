"use client";
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import {  useEffect, useRef, useState } from "react";
import { Canvas, Object } from "fabric";
import {
  handleCanvasMouseUp,
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
  renderCanvas,
  handleCanvasObjectModified,
  handleCanvasSelectionCreated,
  handleCanvasObjectScaling,
  handlePathCreated,
} from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { LiveMap, Lson } from "@liveblocks/client";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<Object | null>(null);
  const isEditingRef = useRef(false);
  const canvasObjects = useStorage((root) => root.canvasObjects);
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects?.set(objectId, shapeData);
  }, []);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    height: "",
    width: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
  });
  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects") as LiveMap<string, Lson>;
    if (!canvasObjects || canvasObjects.size === 0) return true;
    for (const [key] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);
  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    /**
     * canvasObjects is a Map that contains all the shapes in the key-value.
     * Like a store. We can create multiple stores in liveblocks.
     *
     * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
     */
    const canvasObjects = storage.get("canvasObjects") as LiveMap<string, Lson>;
    canvasObjects?.delete(shapeId);
  }, []);
  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      case "reset":
        setActiveElement(defaultNavElement);
        deleteAllShapes();
        fabricRef.current?.clear();
        break;
      case "delete":
        // delete it from the canvas
        handleDelete(fabricRef.current!, deleteShapeFromStorage);
        // set "select" as the active element
        setActiveElement(defaultNavElement);
        break;
      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;
        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;
      default:
        break;
    }
    selectedShapeRef.current = elem?.value as string;
  };
  useEffect(() => {
    const canvas = initializeFabric({ fabricRef, canvasRef });
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        isDrawing,
        canvas,
        shapeRef,
        selectedShapeRef,
      });
    });
    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        isDrawing,
        canvas,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
      });
    });
    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });
    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });
    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });
    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes
      })
    })
    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage
      })
    })
    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current });
    });
    window.addEventListener("keydown", (e) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        syncShapeInStorage,
        undo,
        redo,
        deleteShapeFromStorage,
      });
    });
    return () => {
    };
  }, [canvasRef]);
  useEffect(() => {
    
    renderCanvas({
      fabricRef,
      activeObjectRef,
      canvasObjects,
    });
  }, [canvasObjects]);
  return (
    <main className="text-3xl text-white h-screen overflow-hidden ">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files![0],
            canvas: fabricRef,
            syncShapeInStorage,
            shapeRef,
          });
        }}
      />
      <section className="flex h-full flex-row">
        <LeftSidebar
          allShapes={canvasObjects ? Array.from(canvasObjects) : []}
        />
        <Live canvasRef={canvasRef} undo={undo} redo={redo} />
        <RightSidebar
          activeObjectRef={activeObjectRef}
          isEditingRef={isEditingRef}
          fabricRef={fabricRef}
          setElementAttributes={setElementAttributes}
          elementAttributes={elementAttributes}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
}
