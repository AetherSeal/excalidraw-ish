"use client";
import React, { useEffect, useRef, useState } from "react";
import ToolPanel from "./tools/toolPanel";
import { useCanvasContext } from "@/hooks/canvasHooks";
import { CiUndo, CiRedo } from "react-icons/ci";

export default function Canvas() {
  const {
    currentTool,
    currentColor,
    currentSize,
    isFilled,
    isDrawing,
    setIsDrawing,
    currentText,
    setCurrentText,
    action,
    setAction,
    history,
    setHistory,
  } = useCanvasContext();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const historyIndex = useRef<number | null>(null);

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
  }, []);

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
  }, [currentTool]);

  const handleStartDraw = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { offsetX, offsetY } = event.nativeEvent;
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
    //----------------------------
    // set the start point for the rectangle or ellipse
    startXRef.current = offsetX;
    startYRef.current = offsetY;
    // set the color and size of the drawing
    contextRef.current.lineCap = "round";
    contextRef.current.strokeStyle = currentColor;
    contextRef.current.lineWidth = currentSize;
    // start drawing
    contextRef.current.beginPath();
    // move the cursor to the starting point
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    if (currentTool === "text") {
      setAction("writing");
      if (!textAreaRef.current) return;
      const textArea = textAreaRef.current;
      textArea.style.top = startYRef.current + "px";
      textArea.style.left = startXRef.current + "px";
    }
  };
  const handleDraw = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;
    if (!contextRef.current) return;
    // get the current position of the mouse
    const { offsetX, offsetY } = event.nativeEvent;

    if (currentTool === "draw") {
      //   set the global composite operation to source-over to draw the ellipse
      contextRef.current.globalCompositeOperation = "source-over";
      // draw a line from the last position to the current position
      contextRef.current.lineTo(offsetX, offsetY);
      // stroke the line
      contextRef.current.stroke();
    }
    if (currentTool === "rectangle") {
      if (!snapshotRef.current) return;
      //   set the global composite operation to source-over to draw the ellipse
      contextRef.current.globalCompositeOperation = "source-over";
      //   clear the canvas with the snapshot
      contextRef.current.putImageData(snapshotRef.current, 0, 0);
      //   set the end point for the rectangle
      const width = offsetX - startXRef.current;
      const height = offsetY - startYRef.current;
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
    }
    if (currentTool === "ellipse") {
      if (!snapshotRef.current) return;
      //   set the global composite operation to source-over to draw the ellipse
      contextRef.current.globalCompositeOperation = "source-over";
      //   clear the canvas with the snapshot
      contextRef.current.putImageData(snapshotRef.current, 0, 0);
      //   set the end point for the ellipse
      const width = offsetX - startXRef.current;
      const height = offsetY - startYRef.current;
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
    }
    if (currentTool === "triangle") {
      if (!snapshotRef.current) return;
      // Set the global composite operation to source-over to draw the triangle
      contextRef.current.globalCompositeOperation = "source-over";
      // Clear the canvas with the snapshot
      contextRef.current.putImageData(snapshotRef.current, 0, 0);
      // Draw the triangle
      contextRef.current.beginPath();
      contextRef.current.moveTo(startXRef.current, startYRef.current);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.lineTo(startXRef.current * 2 - offsetX, offsetY);

      contextRef.current.closePath();
      if (isFilled) {
        // Fill the triangle
        contextRef.current.fillStyle = currentColor;
        contextRef.current.fill();
      }
      // Stroke the triangle
      contextRef.current.stroke();
    }
    if (currentTool === "line") {
      if (!snapshotRef.current) return;
      //   set the global composite operation to source-over to draw the ellipse
      contextRef.current.globalCompositeOperation = "source-over";
      //   clear the canvas with the snapshot
      contextRef.current.putImageData(snapshotRef.current, 0, 0);

      //   draw the line
      contextRef.current.beginPath();
      contextRef.current.moveTo(startXRef.current, startYRef.current);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
    if (currentTool === "erase") {
      //set the global composite operation to destination-out to erase the content that overlaps with the eraser
      contextRef.current.globalCompositeOperation = "destination-out";
      // draw a line from the last position to the current position
      contextRef.current.lineTo(offsetX, offsetY);
      // stroke the line
      contextRef.current.stroke();
    }
    if (currentTool === "smudge") {
      contextRef.current.globalCompositeOperation = "source-over";
      const smudgeSize = currentSize * 2;
      const imageData = contextRef.current.getImageData(
        offsetX - smudgeSize / 2,
        offsetY - smudgeSize / 2,
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
        offsetX - smudgeSize / 2,
        offsetY - smudgeSize / 2,
        smudgeSize,
        smudgeSize
      );
    }
  };
  const handleStopDraw = () => {
    if (action === "writing") {
      if (!textAreaRef.current) return;
      const textArea = textAreaRef.current;
      textArea.focus();
      return;
    }
    contextRef.current?.closePath();
    setIsDrawing(false);
  };
  const handlePressEnter = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      setAction("drawing");
      console.log("enter");
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
    }
  };
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
    <section>
      <section>
        <ToolPanel />
        <button
          onClick={() => handleUndo()}
          className={`fixed p-2 bg-slate-700 text-white rounded ${
            history.length ? "" : "bottom-[-100px]"
          } transition-all bottom-4 left-4 z-10 hover:scale-110 active:scale-105`}
        >
          <CiUndo />
        </button>
        <button
          onClick={() => handleRedo()}
          className={`fixed p-2 bg-slate-700 text-white rounded ${
            history.length ? "" : "bottom-[-100px]"
          } transition-all bottom-4 left-14 z-10 hover:scale-110 active:scale-105`}
        >
          <CiRedo />
        </button>
      </section>
      <div className="relative">
        <textarea
          ref={textAreaRef}
          value={currentText}
          onChange={(event) => setCurrentText(event.target.value)}
          onKeyDown={handlePressEnter}
          className={`absolute text-black p-2 ${
            action === "writing" ? "block" : "hidden"
          }`}
        ></textarea>
        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDraw}
          onMouseMove={handleDraw}
          onMouseUp={handleStopDraw}
          onMouseLeave={handleStopDraw}
          className="border-2 border-black border-solid bg-slate-200"
        ></canvas>
      </div>
    </section>
  );
}
