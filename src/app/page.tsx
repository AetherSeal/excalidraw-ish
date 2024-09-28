"use client";
import Canvas from "@/components/canvas";
import { CanvasContextProvider } from "@/context/canvasContext";

export default function Home() {
  return (
    <main>
      <CanvasContextProvider>
        <Canvas />
      </CanvasContextProvider>
    </main>
  );
}
