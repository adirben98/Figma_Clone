import { BaseUserMeta, User } from "@liveblocks/client";
import { Gradient, Pattern } from "fabric/fabric-impl";
import  { Canvas,Object, Path } from "fabric";

export enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

export type CursorState =
  | {
      mode: CursorMode.Hidden;
    }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | {
      mode: CursorMode.ReactionSelector;
    }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };

export type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

export type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};

export type ShapeData = {
  type: string;
  width: number;
  height: number;
  fill: string | Pattern | Gradient;
  left: number;
  top: number;
  objectId: string | undefined;
};

export type Attributes = {
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};

export type ActiveElement = {
  name: string;
  value: string;
  icon: string;
} | null;

export interface CustomFabricObject<T extends Object>
  extends Object {
  objectId?: string;
}

export type ModifyShape = {
  canvas: Canvas;
  property: string;
  value: any;
  activeObjectRef: React.RefObject<Object | null>;
  syncShapeInStorage: (shape: Object) => void;
};

export type ElementDirection = {
  canvas: Canvas;
  direction: string;
  syncShapeInStorage: (shape: Object) => void;
};

export type ImageUpload = {
  file: File;
  canvas: React.RefObject<Canvas>;
  shapeRef: React.RefObject<Object | null>;
  syncShapeInStorage: (shape: Object) => void;
};

export type RightSidebarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<Canvas | null>;
  activeObjectRef: React.RefObject<Object | null>;
  isEditingRef: React.RefObject<boolean>;
  syncShapeInStorage: (obj: any) => void;
};

export type NavbarProps = {
  activeElement: ActiveElement;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleActiveElement: (element: ActiveElement) => void;
};

export type ShapesMenuProps = {
  item: {
    name: string;
    icon: string;
    value: Array<ActiveElement>;
  };
  activeElement: any;
  handleActiveElement: any;
  handleImageUpload: any;
  imageInputRef: any;
};

export type Presence = any;

export type LiveCursorProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

export type CanvasMouseDown = {
  options: any;
  canvas: Canvas;
  selectedShapeRef: any;
  isDrawing: React.RefObject<boolean>;
  shapeRef: React.RefObject<Object | null>;
};

export type CanvasMouseMove = {
  options: any;
  canvas: Canvas;
  isDrawing: React.RefObject<boolean>;
  selectedShapeRef: any;
  shapeRef: any;
  syncShapeInStorage: (shape: Object) => void;
};

export type CanvasMouseUp = {
  canvas: Canvas;
  isDrawing: React.RefObject<boolean>;
  shapeRef: any;
  activeObjectRef: React.RefObject<Object | null>;
  selectedShapeRef: any;
  syncShapeInStorage: (shape: Object) => void;
  setActiveElement: any;
};

export type CanvasObjectModified = {
  options: any;
  syncShapeInStorage: (shape: Object) => void;
};

export type CanvasPathCreated = {
  options: (any & { path: CustomFabricObject<Path> }) | any;
  syncShapeInStorage: (shape: Object) => void;
};

export type CanvasSelectionCreated = {
  options: any;
  isEditingRef: React.RefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasObjectScaling = {
  options: any;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type RenderCanvas = {
  fabricRef: React.RefObject<Canvas | null>;
  canvasObjects: any;
  activeObjectRef: any;
};

export type CursorChatProps = {
  cursor: { x: number; y: number };
  cursorState: CursorState;
  setCursorState: (cursorState: CursorState) => void;
  updateMyPresence: (
    presence: Partial<{
      cursor: { x: number; y: number };
      cursorColor: string;
      message: string;
    }>
  ) => void;
};
