"use client";

import React from "react";
import { Game } from "@/class/game";
import { Button } from "@/components/ui/button";
import { Loader, Play, PlayCircle } from "lucide-react";

export default function Home() {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  let game: Game | null = null;

  React.useEffect(() => {
    if (!canvas.current) return;
    game = new Game(canvas.current);
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen sm:justify-center">
      <div className="relative flex flex-col items-center justify-center w-full max-w-2xl overflow-hidden sm:border sm:rounded">
        <canvas
          ref={canvas}
          width={500}
          height={600}
          className="w-full max-w-full bg-white border-b sm:border-b-0 dark:bg-black"
          // style={{ imageRendering: "pixelated" }}
        />

        <div
          id="screen"
          className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-950"
        >
          <div
            id="loading"
            className="flex items-center text-sm italic gap-x-2"
          >
            <Loader className={"animate-spin"} />l o a d i n g . . .
          </div>

          <div id="play" className="hidden">
            <Button
              size={"lg"}
              variant={"outline"}
              onClick={() => game?.start()}
              className="text-base font-extrabold cursor-pointer"
            >
              <Play className={"size-6 fill-black dark:fill-white"} /> P L A Y
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around w-full max-w-2xl mt-8 select-none sm:hidden">
        <div className="flex gap-4">
          <Button id="left" size={"lg"} variant={"outline"}>
            LEFT
          </Button>
          <Button id="right" size={"lg"} variant={"outline"}>
            RIGHT
          </Button>
        </div>

        <Button id="shoot" size={"lg"} variant={"outline"}>
          SHOT
        </Button>
      </div>
    </main>
  );
}
