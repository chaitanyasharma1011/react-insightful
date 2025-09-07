//list of possible event types
export type InsightEventType =
  | "click"
  | "hover"
  | "focus"
  | "input"
  | "scroll"
  | "keydown"
  | "time_on_page"
  | "custom";

export interface RectSpecs {
  width: number;
  height: number;
}

//format for recording 'scroll' event's data
export interface ScrollData {
  scrollPercentage: RectSpecs;
  element: RectSpecs;
  client: RectSpecs;
}

export interface ElementDetails {
  tag: string;
  id?: string;
  classList?: string[];
  textContentSnippet?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Context {
  route?: string;
  userId?: string;
  sessionId?: string;
  customContext?: Record<string, any>;
}

export interface InsightEvent {
  id: string;
  type: InsightEventType;
  timeStamp: number;

  //Optional depending on event type
  element?: ElementDetails;
  position?: Position;
  scrollData?: ScrollData;

  //Extra user-defined metadata
  metadata?: Record<string, any>;
  componentName?: string;

  //App-level context (can be passed via InsightProvider)
  context?: Context;
}
