import { Tool } from "@/utils/types";
import React from "react";

type TTool = {
  type: Tool;
  setCurrentTool: React.Dispatch<React.SetStateAction<Tool | undefined>>;
};
export default function ToolButton({ type, setCurrentTool }: TTool) {
  const handleToolChange = () => {
    setCurrentTool(type);
  };
  return (
    <button
      className="border-1 rounded-lg px-4 py-2 bg-lime-600 hover:bg-lime-800 active:bg-lime-700"
      onClick={handleToolChange}
    >
      {type}
    </button>
  );
}
