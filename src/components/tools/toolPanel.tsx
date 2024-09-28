import React from "react";
import { useCanvasContext } from "@/hooks/canvasHooks";
import { TOOLS } from "@/utils/constants";
import { TTool } from "@/utils/types";
import {
  IoEllipseOutline,
  IoSquareOutline,
  IoTriangleOutline,
  IoPencilOutline,
  IoBrushOutline,
} from "react-icons/io5";
import { BsEraser } from "react-icons/bs";
import { CiRuler, CiText } from "react-icons/ci";

export default function ToolPanel() {
  return (
    <section>
      <ColorPicker />
      <SizeBar />
      <FillCheckbox />
      <ToolButtons />
    </section>
  );
}

function ColorPicker() {
  const { setCurrentColor, currentColor } = useCanvasContext();
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(event.target.value);
  };
  return (
    <label htmlFor="color">
      Color
      <input
        type="color"
        name=""
        id="color"
        onChange={handleColorChange}
        value={currentColor}
      />
    </label>
  );
}
function SizeBar() {
  const { currentSize, setCurrentSize } = useCanvasContext();
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSize(parseInt(event.target.value));
  };
  return (
    <label htmlFor="size">
      Size {currentSize}
      <input
        type="range"
        name="size"
        id="size"
        value={currentSize}
        min={0}
        max={50}
        onChange={handleSizeChange}
      />
    </label>
  );
}
function FillCheckbox() {
  const { isFilled, setIsFilled } = useCanvasContext();
  const handleFillChange = () => {
    setIsFilled((prev) => !prev);
  };
  return (
    <label htmlFor="fill">
      Fill
      <input
        type="checkbox"
        name="fill"
        id="fill"
        checked={isFilled}
        onChange={handleFillChange}
      />
    </label>
  );
}
function ToolButtons() {
  const renderButtons = () => {
    return TOOLS.map((currentTool) => {
      return <ToolButton type={currentTool} key={currentTool}></ToolButton>;
    });
  };
  return <div>{renderButtons()}</div>;
}
function ToolButton({ type }: { type: TTool }) {
  const { currentTool, setCurrentTool } = useCanvasContext();
  const handleClick = () => {
    setCurrentTool(type);
  };
  const handleIcon = () => {
    switch (type) {
      case "ellipse":
        return <IoEllipseOutline />;
      case "rectangle":
        return <IoSquareOutline />;
      case "triangle":
        return <IoTriangleOutline />;
      case "line":
        return <CiRuler />;
      case "draw":
        return <IoPencilOutline />;
      case "erase":
        return <BsEraser />;
      case "smudge":
        return <IoBrushOutline />;
      case "text":
        return <CiText />;
      default:
        return type;
    }
  };
  return (
    <button
      className={`bg-red-700 text-white p-2 mx-2 ${
        type === currentTool ? "ring-2 ring-yellow-500" : ""
      }`}
      onClick={handleClick}
      role="button"
    >
      {handleIcon()}
    </button>
  );
}
