import React from "react";
import { useInsight } from "../hooks/useInsight";

interface InsightProps {
  track: ReturnType<typeof useInsight>["track"];
}

export const withInsight = <P extends InsightProps>(
  WrappedComponent: React.ComponentType<Omit<P, keyof InsightProps>>
): React.FC<Omit<P, keyof InsightProps>> => {
  return (props) => {
    const { track } = useInsight();
    return <WrappedComponent {...(props as P)} track={track} />;
  };
};
