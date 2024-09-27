"use client";
import { TOOLS } from "@/utils/constants";
import { Tool } from "@/utils/types";
import React, { useState } from "react";
import ToolButton from "./toolButton";
import ColorPicker from "./colorPicker";

export default function Canvas() {
  const [currentTool, setCurrentTool] = useState<Tool>();
  const [currentColor, setCurrentColor] = useState("#fff");

  const handleStartDraw = () => {};
  const handleDraw = () => {};
  const handleStopDraw = () => {};

  const renderTools = () => {
    return TOOLS.map((currentTool) => {
      return (
        <ToolButton
          type={currentTool}
          setCurrentTool={setCurrentTool}
          key={currentTool}
        ></ToolButton>
      );
    });
  };
  return (
    <section>
      <h1>Canvas</h1>
      <h1>current tool: {currentTool}</h1>
      <h2>current color: {currentColor}</h2>
      <section>
        <input type="number" id="size" value="1" />
        <ColorPicker
          setCurrentColor={setCurrentColor}
          currentColor={currentColor}
        />

        {renderTools()}
      </section>
      <canvas
        onMouseDown={handleStartDraw}
        onMouseMove={handleDraw}
        onMouseUp={handleStopDraw}
        onMouseLeave={handleStopDraw}
      ></canvas>
    </section>
  );
}
