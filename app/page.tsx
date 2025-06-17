"use client";

import React from "react";
import { Game } from "@/class/game";
import { Button } from "@/components/ui/button";

export default function Home() {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  let game: Game | null = null;

  React.useEffect(() => {
    if (!canvas.current) return;
    game = new Game(canvas.current);
    // console.log(hero);
    game.start();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen sm:justify-center">
      <div className="relative flex flex-col items-center justify-center w-full max-w-2xl overflow-hidden sm:border sm:rounded">
        <canvas
          ref={canvas}
          width={500}
          height={600}
          className="w-full max-w-full bg-white dark:bg-black"
          // style={{ imageRendering: "pixelated" }}
        />

        <div
          id="canvasLoader"
          className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-800"
        >
          <em className="text-sm font-extrabold animate-pulse">
            l o a d i n g . . .
          </em>
        </div>
      </div>

      <div className="flex items-center justify-around w-full max-w-2xl mt-6 select-none sm:hidden">
        <div className="flex gap-4">
          <Button id="left">LEFT</Button>
          <Button id="right">RIGHT</Button>
        </div>

        <Button id="shoot">SHOT</Button>
      </div>
    </main>
  );
}
