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
  return <button onClick={handleToolChange}>{type}</button>;
}
