import type { InsightEvent } from "../types";

export const defaultEventLogger = (event: InsightEvent) => {
  console.groupCollapsed(
    `%c[Insight] ${event.type.toUpperCase()} - ${event.componentName ?? "Unknown Component"}`,
    "color: #0c8f8f; font-weight: bold;"
  );

  console.log("%cEvent ID:", "color: gray;", event.id);
  console.log(
    "%cTimestamp:",
    "color: gray;",
    new Date(event.timeStamp).toLocaleString()
  );

  if (event.element) {
    console.log("%cElement:", "color: #a371f7;", event.element);
  }

  if (event.position) {
    console.log("%cPosition:", "color: #f6c90e;", event.position);
  }

  if (event.scrollData) {
    console.log("%cScroll Data:", "color: #ff6f61;", event.scrollData);
  }

  if (event.metadata) {
    console.log("%cMetadata:", "color: #4caf50;", event.metadata);
  }

  if (event.context) {
    console.log("%cContext:", "color: #2196f3;", event.context);
  }

  console.groupEnd();
};
