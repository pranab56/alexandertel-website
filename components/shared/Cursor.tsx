"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function Cursor() {
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "view" | "cart">("default");
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorAttr === "view") {
        setCursorType("view");
      } else if (cursorAttr === "cart") {
        setCursorType("cart");
      } else if (
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      ) {
        setCursorType("pointer");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <motion.div
        className="flex items-center justify-center rounded-full border border-primary/30 bg-white/10 backdrop-blur-[2px] shadow-lg"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
          position: "fixed",
        }}
        animate={{
          width: cursorType === "view" || cursorType === "cart" ? 80 : cursorType === "pointer" ? 60 : 20,
          height: cursorType === "view" || cursorType === "cart" ? 80 : cursorType === "pointer" ? 60 : 20,
          left: cursorType === "view" || cursorType === "cart" ? -40 : cursorType === "pointer" ? -30 : -10,
          top: cursorType === "view" || cursorType === "cart" ? -40 : cursorType === "pointer" ? -30 : -10,
          backgroundColor: cursorType === "default" ? "rgba(108, 99, 255, 0.1)" : "rgba(108, 99, 255, 0.2)",
          borderColor: cursorType === "default" ? "rgba(108, 99, 255, 0.3)" : "rgba(108, 99, 255, 0.6)",
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
        }}
      >
        <AnimatePresence mode="wait">
          {cursorType === "view" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              View
            </motion.span>
          )}
          {cursorType === "cart" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              Add
            </motion.span>
          )}
          {cursorType === "default" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-1 w-1 rounded-full bg-primary"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
