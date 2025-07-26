import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { InsightEvent } from "../types";

type LoggerFn = (event: InsightEvent) => void;

interface InsightContextProps {
  logger: LoggerFn;
  globalContext: Partial<InsightEvent["context"]>;
  devMode?: boolean;
}

interface InsightProviderProps {
  children: ReactNode;
  logger: LoggerFn;
  userId?: string;
  sessionId?: string;
  route?: string;
  devMode?: boolean;
  customContext?: Record<string, any>;
}

const InsightContext = createContext<InsightContextProps | undefined>(
  undefined
);

export const InsightProvider = ({
  children,
  logger,
  userId,
  sessionId,
  route,
  devMode = false,
  customContext,
}: InsightProviderProps) => {
  const value: InsightContextProps = useMemo(
    () => ({
      logger,
      globalContext: {
        userId,
        sessionId,
        route,
        customContext,
      },
      devMode,
    }),
    [logger, userId, sessionId, route, customContext]
  );
  return (
    <InsightContext.Provider value={value}>{children}</InsightContext.Provider>
  );
};

export const useInsightContext = () => {
  const context = useContext(InsightContext);
  if (!context)
    throw new Error("useInsight must be used within an <InsightProvider>");
  return context;
};
