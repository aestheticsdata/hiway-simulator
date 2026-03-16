"use client";

import { useEffect, type RefObject } from "react";

export function useScrollForwarding(
  paneRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const pane = paneRef.current;
      if (!pane) return;
      if (pane.contains(e.target as Node)) return;

      const { scrollTop, scrollHeight, clientHeight } = pane;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) return;

      e.preventDefault();
      pane.scrollTop += e.deltaY;
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [paneRef]);
}
