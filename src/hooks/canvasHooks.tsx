import { CanvasContext } from "@/context/canvasContext";
import { useContext } from "react";

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error(
      "Canvas Context must be used within a Canvas Context Provider"
    );
  }
  return context;
};
