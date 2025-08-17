import { v4 } from "uuid";
import { useInsightContext } from "../components/InsightProvider";
import type { ElementDetails, InsightEvent, InsightEventType } from "../types";
import { defaultEventLogger } from "../utils/eventLogger";

export const useInsight = () => {
  const { logger, globalContext, devMode } = useInsightContext();

  const getElementDetails = (el: HTMLElement): ElementDetails => ({
    tag: el.tagName,
    id: el?.id || undefined,
    classList: Array.from(el.classList) || undefined,
    textContentSnippet: el.textContent?.slice(0, 100).trim() || undefined,
  });

  const getMousePosition = (
    e: MouseEvent | React.MouseEvent
  ): { x: number; y: number } => ({
    x: e.clientX,
    y: e.clientY,
  });

  const track = (
    type: InsightEventType,
    element: HTMLElement,
    metadata: Record<string, any> = {},
    e?: MouseEvent | React.MouseEvent
  ) => {
    const { componentName, scrollData, ...restMetadata } = metadata ?? {};
    const event: InsightEvent = {
      id: v4(),
      type,
      timeStamp: Date.now(),
      element: getElementDetails(element),
      position: e ? getMousePosition(e) : undefined,
      metadata: restMetadata,
      componentName: metadata?.componentName,
      scrollData: metadata?.scrollData,
      context: globalContext,
    };
    if (devMode) defaultEventLogger(event);
    logger(event);
  };
  return { track };
};
