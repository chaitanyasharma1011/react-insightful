import { useLayoutEffect, useRef, type ReactNode } from "react";
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
  const maxScreenSlide = useRef<number>(0);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const { boundingClientRect, intersectionRect } = entry;
          //scrolled height so far
          const visibleHeight = intersectionRect.height;
          const totalHeight = boundingClientRect.height;
          const pastTop = Math.min(0, boundingClientRect.top);
          const scrolledHeight = visibleHeight - pastTop;

          //scrolled width so far
          const visibleWidth = intersectionRect.width;
          const totalWidth = boundingClientRect.width;
          const pastLeft = Math.min(0, boundingClientRect.left);
          const scrolledWidth = visibleWidth - pastLeft;
          if (totalHeight)
            maxScreenDepth.current = Math.max(
              maxScreenDepth.current,
              scrolledHeight / totalHeight
            );
          if (totalWidth)
            maxScreenSlide.current = Math.max(
              maxScreenSlide.current,
              scrolledWidth / totalWidth
            );
        });
      },
      {
        root: null,
        threshold: Array.from({ length: 100 }, (_, i) => i / 100),
      }
    );
    if (enclosingRef.current) observer.observe(enclosingRef.current);
    const element = enclosingRef.current; // cache the DOM node
    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
      if (element && maxScreenSlide.current && maxScreenDepth.current) {
        const scrollData = {
          scrollPercentage: {
            width: parseFloat((maxScreenSlide.current * 100).toFixed(1)),
            height: parseFloat((maxScreenDepth.current * 100).toFixed(1)),
          },
          element: {
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height,
          },
          client: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        };
        track("scroll", element, { componentName, scrollData });
      }
    };
    // const handleScroll = () => {
    //   if (timeout.current) {
    //     clearTimeout(timeout.current);
    //   }
    //   timeout.current = setTimeout(() => {
    //     if (!enclosingRef.current) return;
    //     const rect = enclosingRef.current.getBoundingClientRect();
    //     if (rect.top >= window.innerHeight) return;
    //     const viewedTop = rect.top;
    //     const visibleBottom = Math.min(window.innerHeight, rect.bottom);
    //     const scrolledHeight = Math.min(visibleBottom - viewedTop, rect.height);
    //     maxScreenDepth.current = Math.max(
    //       scrolledHeight / rect.height,
    //       maxScreenDepth.current
    //     );
    //   }, 200);
    // };
    // handleScroll();
    // window.addEventListener("scroll", handleScroll);
    // const element = enclosingRef.current; // cache the DOM node

    // return () => {
    //   window.removeEventListener("scroll", handleScroll);
    //   if (timeout.current) {
    //     clearTimeout(timeout.current);
    //   }
    //   if (!element) return;
    //   const scrollData = {
    //     scrollPercentage: (maxScreenDepth.current * 100).toFixed(1),
    //     elementHeight: element.getBoundingClientRect().height,
    //     clientHeight: window.innerHeight,
    //   };

    //   track("scroll", element, { componentName, scrollData });
    // };
  }, [componentName]);

  return <div ref={enclosingRef}>{children}</div>;
}
