import { CanvasContext } from "@/context/canvasContext";
import { useContext, useEffect } from "react";

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error(
      "Canvas Context must be used within a Canvas Context Provider"
    );
  }
  return context;
};

export const useCanvasSetup = () => {
  const { canvasRef, contextRef, currentTool } = useCanvasContext();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    // context.scale(2, 2);
    contextRef.current = context;
  }, [canvasRef, contextRef]);
  useEffect(() => {
    if (currentTool === "clear") {
      if (!contextRef.current) return;
      if (!canvasRef.current) return;
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      return;
    }
  }, [currentTool, canvasRef, contextRef]);
};
