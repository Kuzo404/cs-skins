"use client";

import { useEffect, useCallback, useRef } from "react";

export default function AWPClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);

  useEffect(() => {
    audioRef.current = new Audio("/awm.mp3");
    audioRef.current.volume = 0.4;
  }, []);

  const playAWPShot = useCallback(() => {
    // Throttle - minimum 100ms between shots
    const now = Date.now();
    if (now - lastPlayedRef.current < 100) return;
    lastPlayedRef.current = now;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch (e) {
      // Audio not supported or blocked
    }
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only left click (button 0)
      if (e.button === 0) {
        playAWPShot();
      }
    };

    const handleTouchStart = () => {
      playAWPShot();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [playAWPShot]);

  return null;
}
