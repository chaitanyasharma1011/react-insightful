import React, { useState } from "react";
import {
  InsightProvider,
  ScrollTracker,
  useInsight,
  withInsight,
} from "../../src";

import "./App.css";

// Original hook-based example
const EventLogger = () => {
  const { track } = useInsight();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    track("click", e.currentTarget, { purpose: "Demo Button Click (Hook)" }, e);
  };

  return (
    <div>
      <h2>Click Tracking with useInsight</h2>
      <button onClick={handleClick}>Click Me!</button>
    </div>
  );
};

// ScrollTracker example
const ScrollableSection = () => {
  const [mount, setMount] = useState<boolean>(true);
  return (
    <>
      <button onClick={() => setMount((prev) => !prev)}>Unmount</button>
      {mount ? (
        <ScrollTracker componentName="LongSection">
          <div
            style={{ height: "150vh", padding: "1rem", background: "#e6f7ff" }}
          >
            <h2 style={{ color: "black" }}>Scroll Down</h2>
            <p style={{ color: "black" }}>
              This section logs scroll depth when unmounted.
            </p>
          </div>
        </ScrollTracker>
      ) : null}
    </>
  );
};

// New: withInsight HOC example
const RawHOCComponent = ({ track }: any) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    track("click", e.currentTarget, { purpose: "HOC Button Click" }, e);
  };

  return (
    <div>
      <h2>Click Tracking with withInsight HOC</h2>
      <button onClick={handleClick}>Click Me Too!</button>
    </div>
  );
};

const HOCEndpoint = withInsight(RawHOCComponent);

const App = () => {
  const logger = (event: any) => {
    // console.log("[Insight Event]", event);
  };

  return (
    <InsightProvider
      logger={logger}
      userId="demo-user"
      sessionId="session-001"
      route="/"
      devMode={true}
    >
      <div className="App">
        <h1>React Insightful Demo</h1>
        <EventLogger />
        <HOCEndpoint />
        <ScrollableSection />
      </div>
    </InsightProvider>
  );
};

export default App;
