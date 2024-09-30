"use client";
import ToolPanel from "./tools/toolPanel";
import { useCanvasContext, useCanvasSetup } from "@/hooks/canvasHooks";

export default function Canvas() {
  const {
    currentTool,
    isDrawing,
    currentText,
    setCurrentText,
    action,
    textAreaRef,
    canvasRef,
    drawLine,
    drawRectangle,
    drawEllipse,
    drawTriangle,
    drawStraightLine,
    erase,
    eraseSmudge,
    endPointSetup,
    textareaPrint,
    beginDrawing,
    endDrawing,
  } = useCanvasContext();

  useCanvasSetup();

  const handleStartDraw = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    beginDrawing(event);
  };
  const handleDraw = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;
    // get the current position of the mouse
    endPointSetup(event);

    switch (currentTool) {
      case "draw":
        drawLine();
        break;
      case "rectangle":
        drawRectangle();
        break;
      case "ellipse":
        drawEllipse();
        break;
      case "triangle":
        drawTriangle();
        break;
      case "line":
        drawStraightLine();
        break;
      case "erase":
        erase();
        break;
      case "smudge":
        eraseSmudge();
        break;
    }
  };
  const handleStopDraw = () => {
    endDrawing();
  };
  const handlePressEnter = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      textareaPrint();
    }
  };

  return (
    <section>
      <section>
        <ToolPanel />
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
