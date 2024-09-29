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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
