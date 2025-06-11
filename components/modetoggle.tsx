"use client";

import * as React from "react";
import { Loader, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        size="icon"
        variant="outline"
        className="absolute z-50 top-4 right-4"
      >
        <Loader className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      variant="outline"
      className="absolute z-50 cursor-pointer top-4 right-4"
      onClick={() =>
        resolvedTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
      title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
    >
      <Moon className="transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
