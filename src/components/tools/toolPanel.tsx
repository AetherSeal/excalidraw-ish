import React, { useEffect, useState } from "react";
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
import {
  CiRuler,
  CiText,
  CiTrash,
  CiUndo,
  CiRedo,
  CiSaveDown2,
} from "react-icons/ci";
import { TbBackground } from "react-icons/tb";
import { FaSquareFull } from "react-icons/fa";

export default function ToolPanel() {
  return (
    <section>
      <div className="flex flex-col fixed top-1/2 -translate-y-1/2 left-4 z-10 bg-slate-700 max-w-24 rounded-lg p-4">
        <DefaultColors />
        <ColorPicker />
        <SizeBar />
      </div>

      <ToolButtons />
      <UndoButton />
      <RedoButton />
      <SaveButton />
    </section>
  );
}

function ColorPicker() {
  const { setCurrentColor, currentColor } = useCanvasContext();
  useEffect(() => {
    console.log(currentColor);
  }, [currentColor]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(event.target.value);
  };
  return (
    <label htmlFor="color">
      <p className="text-xs">Color</p>
      <input
        type="color"
        name=""
        id="color"
        onChange={handleColorChange}
        value={currentColor}
        className="w-full rounded bg-transparent  hover:scale-110"
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
      <p className="text-xs capitalize"> Size {currentSize}px</p>
      <input
        type="range"
        name="size"
        id="size"
        value={currentSize}
        min={0}
        max={50}
        onChange={handleSizeChange}
        className="w-full  hover:scale-110"
      />
    </label>
  );
}
function FillCheckbox() {
  const { isFilled, setIsFilled } = useCanvasContext();
  return (
    <>
      <button
        className={` text-white p-2 rounded hover:bg-slate-600 ${
          !isFilled ? "bg-gray-500" : ""
        }`}
        onClick={() => setIsFilled(false)}
        role="button"
      >
        <TbBackground />
      </button>
      <button
        className={` text-white p-2 rounded hover:bg-slate-600 ${
          isFilled ? "bg-gray-500" : ""
        }`}
        onClick={() => setIsFilled(true)}
        role="button"
      >
        <FaSquareFull />
      </button>
    </>
  );
}
function ToolButtons() {
  const renderButtons = () => {
    return TOOLS.map((currentTool) => {
      return <ToolButton type={currentTool} key={currentTool}></ToolButton>;
    });
  };
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 p-4 bg-slate-700 rounded-md flex flex-wrap gap-2 items-center justify-center z-10">
      {renderButtons()}
      <div className="bg-slate-500 w-[1px] h-6 "></div>
      <FillCheckbox />
    </div>
  );
}
function ToolButton({ type }: { type: TTool }) {
  const { currentTool, setCurrentTool, setAction } = useCanvasContext();
  const handleClick = () => {
    setCurrentTool(type);
    setAction("drawing");
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
      case "clear":
        return <CiTrash />;
      default:
        return type;
    }
  };
  return (
    <button
      className={` text-white p-2 rounded hover:bg-slate-600 ${
        type === currentTool ? "bg-gray-500" : ""
      }`}
      onClick={handleClick}
      role="button"
    >
      {handleIcon()}
    </button>
  );
}
function DefaultColors() {
  const { setCurrentColor } = useCanvasContext();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          setCurrentColor("#000000");
        }}
        className="bg-black w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#ffffff");
        }}
        className="bg-white w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#ff0000");
        }}
        className="bg-red-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#00ff00");
        }}
        className="bg-green-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#0000ff");
        }}
        className="bg-blue-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#ffff00");
        }}
        className="bg-yellow-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#ffa500");
        }}
        className="bg-orange-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#800080");
        }}
        className="bg-purple-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#ff69b4");
        }}
        className="bg-pink-500 w-4 h-4 rounded hover:scale-110"
      ></button>
      <button
        onClick={() => {
          setCurrentColor("#a52a2a");
        }}
        className="bg-brown-500 w-4 h-4 rounded hover:scale-110"
      ></button>
    </div>
  );
}
function UndoButton() {
  const { history, historyIndex, contextRef } = useCanvasContext();
  const handleUndo = () => {
    if (historyIndex.current === null) {
      historyIndex.current = history.length - 1;
    }
    if (historyIndex.current > 0) {
      historyIndex.current--;
      const previousSnapshot = history[historyIndex.current];
      if (previousSnapshot && contextRef.current) {
        contextRef.current.putImageData(previousSnapshot, 0, 0);
      }
    }
  };
  return (
    <button
      onClick={() => handleUndo()}
      className={`fixed p-2 bg-slate-700 text-white rounded ${
        history.length ? "" : "bottom-[-100px]"
      } transition-all bottom-4 left-4 z-10 hover:scale-110 active:scale-105`}
    >
      <CiUndo />
    </button>
  );
}
function RedoButton() {
  const { history, historyIndex, contextRef } = useCanvasContext();
  const handleRedo = () => {
    if (historyIndex.current === null) return;
    if (historyIndex.current < history.length - 1) {
      historyIndex.current++;
      const nextSnapshot = history[historyIndex.current];
      if (nextSnapshot && contextRef.current) {
        contextRef.current.putImageData(nextSnapshot, 0, 0);
      }
    }
  };
  return (
    <button
      onClick={() => handleRedo()}
      className={`fixed p-2 bg-slate-700 text-white rounded ${
        history.length ? "" : "bottom-[-100px]"
      } transition-all bottom-4 left-14 z-10 hover:scale-110 active:scale-105`}
    >
      <CiRedo />
    </button>
  );
}
function SaveButton() {
  const { canvasRef, history } = useCanvasContext();
  const saveCanvasAsImage = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "canvas.png";
    link.click();
  };
  return (
    <button
      onClick={() => saveCanvasAsImage()}
      className={`fixed p-2 bg-slate-700 text-white rounded ${
        history.length ? "" : "bottom-[-100px]"
      } transition-all bottom-4 left-24 z-10 hover:scale-110 active:scale-105`}
    >
      <CiSaveDown2 />
    </button>
  );
}
