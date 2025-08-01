import { useEffect, useRef, type ReactNode } from "react";
import { useInsight } from "../hooks/useInsight";

interface ScrollTrackerProps {
  componentName: string;
  children: ReactNode;
}

export default function ScrollTracker({
  componentName,
  children,
}: ScrollTrackerProps) {
  const { track } = useInsight();
  const enclosingRef = useRef<HTMLDivElement>(null);
  const maxScreenDepth = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!enclosingRef.current) return;
      const rect = enclosingRef.current.getBoundingClientRect();
      if (rect.top >= window.innerHeight) return;
      const viewedTop = rect.top;
      const visibleBottom = Math.min(window.innerHeight, rect.bottom);
      const scrolledHeight = Math.min(visibleBottom - viewedTop, rect.height);
      maxScreenDepth.current = Math.max(scrolledHeight / rect.height);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      if (enclosingRef.current) {
        window.removeEventListener("scroll", handleScroll);
        const scrollData = {
          scrollPercentage: (maxScreenDepth.current * 100).toFixed(1),
          elementHeight: enclosingRef.current.getBoundingClientRect().height,
          clientHeight: window.innerHeight,
        };
        track("scroll", enclosingRef.current, { componentName, scrollData });
      }
    };
  }, [componentName]);

  return <div ref={enclosingRef}>{children}</div>;
}
