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
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
  drawLine: () => void;
  drawRectangle: () => void;
  drawEllipse: () => void;
  drawTriangle: () => void;
  drawStar: () => void;
  drawStraightLine: () => void;
  erase: () => void;
  eraseSmudge: () => void;
  textareaPrint: () => void;
  endPointSetup: (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => void;
  beginDrawing: (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => void;
  endDrawing: () => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  undoStack: string[];
  redoStack: string[];
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
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const endXRef = useRef(0);
  const endYRef = useRef(0);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      // Save the current state to the undo stack and add the current state to the undo stack
      setUndoStack((prevUndoStack) => [...prevUndoStack, dataURL]);
      // Clear redo stack when a new action is made
      setRedoStack([]);
    }
  };
  const undo = () => {
    // Check if there are any saved states in the undo stack
    if (undoStack.length > 0) {
      // Get the last state from the undo stack
      const lastState = undoStack[undoStack.length - 1];
      // Remove the last state from the undo stack
      setUndoStack((prevUndoStack) => prevUndoStack.slice(0, -1));
      // Add the last state to the redo stack
      setRedoStack((prevRedoStack) => [
        ...prevRedoStack,
        canvasRef.current?.toDataURL() || "",
      ]);
      // Create a new image element
      const img = new Image();
      // Set the source of the image to the last state
      img.src = lastState;
      // When the image is loaded
      img.onload = () => {
        // Get the canvas and context element
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        // If the canvas and context exist
        if (ctx && canvas) {
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  };
  const redo = () => {
    // Check if there are any saved states in the redo stack
    if (redoStack.length > 0) {
      // Get the last state from the redo stack
      const lastState = redoStack[redoStack.length - 1];
      // Remove the last state from the redo stack
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
      // Add the last state to the undo stack
      setUndoStack((prevUndoStack) => [
        ...prevUndoStack,
        canvasRef.current?.toDataURL() || "",
      ]);
      // Create a new image element
      const img = new Image();
      // Set the source of the image to the last state
      img.src = lastState;
      // When the image is loaded
      img.onload = () => {
        // Get the canvas and context element
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        // If the canvas and context exist
        if (ctx && canvas) {
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  };
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
  // This function should be called during mouse move event
  const drawStar = () => {
    const mouseX = endXRef.current;
    const mouseY = endYRef.current;
    if (!snapshotRef.current || !contextRef.current) return;

    // Calculate the distance between the starting point and current mouse position
    const dx = mouseX - startXRef.current;
    const dy = mouseY - startYRef.current;
    const distance = Math.sqrt(dx * dy + dy * dy);

    // Dynamically set the outer and inner radii based on the distance
    const outerRadius = distance; // Outer radius grows as the mouse moves farther
    const innerRadius = outerRadius / 2; // Inner radius can be half the outer radius for a star look

    // Number of spikes
    const spikes = 8; // Keep this as 5, or allow it to be dynamic if needed

    // Reset the rotation and step angle for star calculation
    let rot = (Math.PI / 2) * 3; // Start rotation, pointing upward
    const step = Math.PI / spikes; // Angle between spikes

    // Set the composite operation and clear the canvas using snapshot
    contextRef.current.globalCompositeOperation = "source-over";
    contextRef.current.putImageData(snapshotRef.current, 0, 0);

    // Begin drawing the star
    contextRef.current.beginPath();
    contextRef.current.moveTo(
      startXRef.current,
      startYRef.current - outerRadius
    ); // Start at the top point

    // Loop through each spike and inner point to create the star shape
    for (let i = 0; i < spikes; i++) {
      // Outer point of the star
      let x = startXRef.current + Math.cos(rot) * outerRadius;
      let y = startYRef.current + Math.sin(rot) * outerRadius;
      contextRef.current.lineTo(x, y); // Draw to outer point
      rot += step; // Increment angle for inner point

      // Inner point of the star
      x = startXRef.current + Math.cos(rot) * innerRadius;
      y = startYRef.current + Math.sin(rot) * innerRadius;
      contextRef.current.lineTo(x, y); // Draw to inner point
      rot += step; // Increment angle for the next spike
    }

    contextRef.current.closePath(); // Close the path

    // If the star should be filled
    if (isFilled) {
      contextRef.current.fillStyle = currentColor; // Set the fill color
      contextRef.current.fill(); // Fill the star
    }

    // Draw the outline (stroke)
    contextRef.current.strokeStyle = currentColor; // Set stroke color
    contextRef.current.stroke(); // Apply the stroke
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
        textAreaRef,
        canvasRef,
        contextRef,
        drawLine,
        drawRectangle,
        drawEllipse,
        drawTriangle,
        drawStar,
        drawStraightLine,
        erase,
        eraseSmudge,
        textareaPrint,
        endPointSetup,
        beginDrawing,
        endDrawing,
        undo,
        redo,
        saveState,
        undoStack,
        redoStack,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
