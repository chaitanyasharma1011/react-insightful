import {
  cloneElement,
  useEffect,
  useRef,
  type ReactElement,
  type RefObject,
} from "react";
import { useInsight } from "../hooks/useInsight";

interface TimeOnPageTrackerProps {
  componentName: string;
  children?: ReactElement<any>;
  targetRef?: React.RefObject<HTMLElement>;
  threshold?: number;
}

export default function TimeOnPageTracker({
  componentName,
  children,
  targetRef,
  threshold = 0.25,
}: TimeOnPageTrackerProps) {
  const { track } = useInsight();
  const startTimeRef = useRef<number | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);
  const totalTimeRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(false);
  const observeRef = targetRef ?? innerRef;

  const stopTimer = () => {
    if (startTimeRef.current) {
      const val = Date.now() - startTimeRef.current;
      if (totalTimeRef.current) totalTimeRef.current += val;
      else totalTimeRef.current = val;
      startTimeRef.current = null;
    }
  };

  const startTimer = () => {
    if (observeRef.current && isVisibleRef.current && !startTimeRef.current)
      startTimeRef.current = Date.now();
  };

  const handleVisibility = () => {
    if (document.hidden) stopTimer();
    else if (isVisibleRef.current) startTimer();
  };

  const handleBlur = () => {
    stopTimer();
  };

  const handleFocus = () => {
    startTimer();
  };

  useEffect(() => {
    if (!observeRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isVisibleRef.current = true;
          startTimer();
        } else {
          isVisibleRef.current = false;
          stopTimer();
        }
      },
      {
        threshold,
      }
    );
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    observer.observe(observeRef.current);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      if (observeRef.current && totalTimeRef.current)
        track("time_on_page", observeRef.current, {
          componentName,
          duration: totalTimeRef.current,
        });
    };
  }, []);

  if (targetRef) return null;
  else if (children) {
    return cloneElement(children, {
      ref: (node: HTMLElement) => {
        innerRef.current = node;
        const { ref } = children as any;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as RefObject<any>).current = node;
      },
    });
  }
  return null;
}
