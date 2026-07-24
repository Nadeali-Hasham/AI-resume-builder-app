import { useCallback, useRef, useState } from "react";

/**
 * Subtle pointer-driven 3D tilt. Disabled when user prefers reduced motion.
 */
export function useTilt3D({ max = 12, perspective = 900 } = {}) {
  const ref = useRef(null);
  const [style, setStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`,
  });

  const reset = useCallback(() => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`,
      transition: "transform 0.45s ease",
    });
  }, [perspective]);

  const onPointerMove = useCallback(
    (event) => {
      if (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = px * max * 2;
      const rotateX = -py * max * 2;
      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.08s ease-out",
      });
    },
    [max, perspective]
  );

  return {
    ref,
    style,
    onPointerMove,
    onPointerLeave: reset,
  };
}
