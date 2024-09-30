import { Actions, TTool } from "@/utils/types";
import React, { createContext, useRef, useState } from "react";

type TCanvasContext = {
  currentTool: TTool;
  setCurrentTool: React.Dispatch<React.SetStateAction<TTool>>;
  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  currentText: string;
  setCurrentText: React.Dispatch<React.SetStateAction<string>>;
  currentSize: number;
  setCurrentSize: React.Dispatch<React.SetStateAction<number>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  action: Actions;
  setAction: React.Dispatch<React.SetStateAction<Actions>>;
  isFilled: boolean;
  setIsFilled: React.Dispatch<React.SetStateAction<boolean>>;
  history: ImageData[];
  setHistory: React.Dispatch<React.SetStateAction<ImageData[]>>;
  historyIndex: React.MutableRefObject<number | null>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
  snapshotRef: React.MutableRefObject<ImageData | null>;
  startXRef: React.MutableRefObject<number>;
  startYRef: React.MutableRefObject<number>;
  endXRef: React.MutableRefObject<number>;
  endYRef: React.MutableRefObject<number>;
  drawLine: () => void;
  drawRectangle: () => void;
  drawEllipse: () => void;
  drawTriangle: () => void;
  drawStraightLine: () => void;
  erase: () => void;
  eraseSmudge: () => void;
  takeSnapshot: () => void;
  contextSetup: () => void;
  textareaSetup: () => void;
  textareaFocus: () => void;
  textareaPrint: () => void;
  startPointSetup: (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => void;
  endPointSetup: (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => void;
  beginDrawing: (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => void;
  endDrawing: () => void;
};
type TCanvasContextProviderProps = {
  children: React.ReactNode;
};

export const CanvasContext = createContext<TCanvasContext | null>(null);
export const CanvasContextProvider = ({
  children,
}: TCanvasContextProviderProps) => {
  const [currentTool, setCurrentTool] = useState<TTool>("draw");
  const [currentColor, setCurrentColor] = useState("black");
  const [currentText, setCurrentText] = useState("");
  const [currentSize, setCurrentSize] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [action, setAction] = useState<Actions>("drawing");
  const [isFilled, setIsFilled] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);
  const historyIndex = useRef<number | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const endXRef = useRef(0);
  const endYRef = useRef(0);

  const beginDrawing = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!contextRef.current) return;
    //take a snapshot of the canvas before drawing
    takeSnapshot();
    //----------------------------
    // set the start point for the rectangle or ellipse
    startPointSetup(event);
    // set the color and size of the drawing
    contextSetup();
    // start drawing
    contextRef.current.beginPath();
    // move the cursor to the starting point
    contextRef.current.moveTo(startXRef.current, startYRef.current);
    setIsDrawing(true);
    textareaSetup();
  };
  const endDrawing = () => {
    textareaFocus();
    contextRef.current?.closePath();
    setIsDrawing(false);
  };
  const startPointSetup = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { offsetX, offsetY } = event.nativeEvent;
    startXRef.current = offsetX;
    startYRef.current = offsetY;
  };
  const endPointSetup = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { offsetX, offsetY } = event.nativeEvent;
    endXRef.current = offsetX;
    endYRef.current = offsetY;
  };
  const textareaPrint = () => {
    setAction("drawing");
    if (!contextRef.current) return;
    contextRef.current.globalCompositeOperation = "source-over";
    contextRef.current.font = `${currentSize * 2}px Arial`;
    contextRef.current.fillStyle = currentColor;
    contextRef.current.fillText(
      currentText,
      startXRef.current,
      startYRef.current
    );
    contextRef.current?.closePath();
    setIsDrawing(false);
    setCurrentText("");
  };
  const textareaSetup = () => {
    if (currentTool === "text") {
      setAction("writing");
      if (!textAreaRef.current) return;
      const textArea = textAreaRef.current;
      textArea.style.top = startYRef.current + "px";
      textArea.style.left = startXRef.current + "px";
    }
  };
  const textareaFocus = () => {
    if (action === "writing") {
      if (!textAreaRef.current) return;
      const textArea = textAreaRef.current;
      textArea.focus();
      return;
    }
  };
  const contextSetup = () => {
    if (!contextRef.current) return;
    // set the color and size of the drawing
    contextRef.current.lineCap = "round";
    contextRef.current.strokeStyle = currentColor;
    contextRef.current.lineWidth = currentSize;
  };
  const takeSnapshot = () => {
    if (!contextRef.current) return;
    if (!canvasRef.current) return;
    // take a snapshot of the canvas before drawing
    snapshotRef.current = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // history--------------------
    setHistory([...history, snapshotRef.current]);
  };
  const drawLine = () => {
    if (!contextRef.current) return;
    //   set the global composite operation to source-over to draw the ellipse
    contextRef.current.globalCompositeOperation = "source-over";
    // draw a line from the last position to the current position
    contextRef.current.lineTo(endXRef.current, endYRef.current);
    // stroke the line
    contextRef.current.stroke();
  };
  const drawRectangle = () => {
    if (!snapshotRef.current) return;
    if (!contextRef.current) return;
    //   set the global composite operation to source-over to draw the ellipse
    contextRef.current.globalCompositeOperation = "source-over";
    //   clear the canvas with the snapshot
    contextRef.current.putImageData(snapshotRef.current, 0, 0);
    //   set the end point for the rectangle
    const width = endXRef.current - startXRef.current;
    const height = endYRef.current - startYRef.current;
    //   draw the rectangle
    contextRef.current.beginPath();
    contextRef.current.rect(
      startXRef.current,
      startYRef.current,
      width,
      height
    );
    if (isFilled) {
      //   fill the rectangle
      contextRef.current.fillStyle = currentColor;
      contextRef.current.fill();
    }
    //   stroke the rectangle
    contextRef.current.stroke();
  };
  const drawEllipse = () => {
    if (!snapshotRef.current) return;
    if (!contextRef.current) return;
    //   set the global composite operation to source-over to draw the ellipse
    contextRef.current.globalCompositeOperation = "source-over";
    //   clear the canvas with the snapshot
    contextRef.current.putImageData(snapshotRef.current, 0, 0);
    //   set the end point for the ellipse
    const width = endXRef.current - startXRef.current;
    const height = endYRef.current - startYRef.current;
    //   draw the ellipse
    contextRef.current.beginPath();
    contextRef.current.ellipse(
      startXRef.current + width / 2,
      startYRef.current + height / 2,
      Math.abs(width / 2),
      Math.abs(height / 2),
      0,
      0,
      2 * Math.PI
    );
    if (isFilled) {
      //   fill the rectangle
      contextRef.current.fillStyle = currentColor;
      contextRef.current.fill();
    }
    //   stroke the rectangle
    contextRef.current.stroke();
  };
  const drawTriangle = () => {
    if (!snapshotRef.current) return;
    if (!contextRef.current) return;

    // Set the global composite operation to source-over to draw the triangle
    contextRef.current.globalCompositeOperation = "source-over";
    // Clear the canvas with the snapshot
    contextRef.current.putImageData(snapshotRef.current, 0, 0);
    // Draw the triangle
    contextRef.current.beginPath();
    contextRef.current.moveTo(startXRef.current, startYRef.current);
    contextRef.current.lineTo(endXRef.current, endYRef.current);
    contextRef.current.lineTo(
      startXRef.current * 2 - endXRef.current,
      endYRef.current
    );

    contextRef.current.closePath();
    if (isFilled) {
      // Fill the triangle
      contextRef.current.fillStyle = currentColor;
      contextRef.current.fill();
    }
    // Stroke the triangle
    contextRef.current.stroke();
  };
  const drawStraightLine = () => {
    if (!snapshotRef.current) return;
    if (!contextRef.current) return;
    //   set the global composite operation to source-over to draw the ellipse
    contextRef.current.globalCompositeOperation = "source-over";
    //   clear the canvas with the snapshot
    contextRef.current.putImageData(snapshotRef.current, 0, 0);

    //   draw the line
    contextRef.current.beginPath();
    contextRef.current.moveTo(startXRef.current, startYRef.current);
    contextRef.current.lineTo(endXRef.current, endYRef.current);
    contextRef.current.stroke();
  };
  const erase = () => {
    if (!contextRef.current) return;
    //set the global composite operation to destination-out to erase the content that overlaps with the eraser
    contextRef.current.globalCompositeOperation = "destination-out";
    // draw a line from the last position to the current position
    contextRef.current.lineTo(endXRef.current, endYRef.current);
    // stroke the line
    contextRef.current.stroke();
  };
  const eraseSmudge = () => {
    if (!contextRef.current) return;
    contextRef.current.globalCompositeOperation = "source-over";
    const smudgeSize = currentSize * 2;
    const imageData = contextRef.current.getImageData(
      endXRef.current - smudgeSize / 2,
      endYRef.current - smudgeSize / 2,
      smudgeSize,
      smudgeSize
    );

    const data = imageData.data;
    let r = 0,
      g = 0,
      b = 0,
      a = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      a += data[i + 3];
    }
    r = Math.floor(r / (data.length / 4));
    g = Math.floor(g / (data.length / 4));
    b = Math.floor(b / (data.length / 4));
    a = Math.floor(a / (data.length / 4));

    contextRef.current.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    contextRef.current.fillRect(
      endXRef.current - smudgeSize / 2,
      endYRef.current - smudgeSize / 2,
      smudgeSize,
      smudgeSize
    );
  };
  return (
    <CanvasContext.Provider
      value={{
        currentTool,
        setCurrentTool,
        currentColor,
        setCurrentColor,
        currentText,
        setCurrentText,
        currentSize,
        setCurrentSize,
        isDrawing,
        setIsDrawing,
        action,
        setAction,
        isFilled,
        setIsFilled,
        history,
        setHistory,
        historyIndex,
        textAreaRef,
        canvasRef,
        contextRef,
        snapshotRef,
        startXRef,
        startYRef,
        endXRef,
        endYRef,
        drawLine,
        drawRectangle,
        drawEllipse,
        drawTriangle,
        drawStraightLine,
        erase,
        eraseSmudge,
        takeSnapshot,
        contextSetup,
        textareaSetup,
        textareaFocus,
        textareaPrint,
        startPointSetup,
        endPointSetup,
        beginDrawing,
        endDrawing,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
