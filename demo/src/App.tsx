import { useState } from "react";
import {
  InsightProvider,
  ScrollTracker,
  useInsight,
  // withInsight,
} from "react-insightful";

import type { InsightEvent } from "react-insightful";

import "./App.css";

const ClickExample = () => {
  const { track } = useInsight();

  return (
    <div className="flex space-x-4 items-center">
      <h2>Click</h2>
      <button
        onClick={(e) =>
          track("click", e.currentTarget, { label: "Click Button" }, e)
        }
      >
        Click Me
      </button>
    </div>
  );
};

const HoverExample = () => {
  const { track } = useInsight();

  return (
    <div className="flex space-x-4 items-center">
      <h2>Hover</h2>
      <div
        onMouseEnter={(e) =>
          track(
            "hover",
            e.currentTarget,
            { componentName: "Hover Component", label: "Hovered Div" },
            e
          )
        }
        style={{
          padding: "1rem",
          background: "#dff0d8",
          display: "inline-block",
          color: "black",
        }}
      >
        Hover Over Me
      </div>
    </div>
  );
};

const FocusExample = () => {
  const { track } = useInsight();

  return (
    <div className="flex space-x-4 items-center">
      <h2>Focus</h2>
      <input
        type="text"
        className="border p-2"
        placeholder="Focus on me"
        onFocus={(e) =>
          track("focus", e.currentTarget, { label: "Input Focused" })
        }
      />
    </div>
  );
};

const InputExample = () => {
  const { track } = useInsight();

  return (
    <div className="flex space-x-4 items-center">
      <h2>Input</h2>
      <input
        type="text"
        className="border p-2"
        placeholder="Type something"
        onInput={(e) =>
          track("input", e.currentTarget, { value: e.currentTarget.value })
        }
      />
    </div>
  );
};

const ScrollExample = () => {
  const [mount, setMount] = useState(true);

  return (
    <div className="flex flex-col space-y-4 items-start">
      <h2>
        Scroll (Event will be triggered when the bellow component unmounts)
      </h2>
      <button onClick={() => setMount((prev) => !prev)}>
        {mount ? "Unmount ScrollTracker" : "Mount ScrollTracker"}
      </button>
      {mount && (
        <div className="w-full">
          <ScrollTracker componentName="LongSection">
            <div
              style={{
                height: "150vh",
                background: "#f5f5f5",
                padding: "1rem",
              }}
            >
              <p>Scroll me!</p>
            </div>
          </ScrollTracker>
        </div>
      )}
    </div>
  );
};

const KeydownExample = () => {
  const { track } = useInsight();

  return (
    <div className="flex space-x-4 items-center">
      <h2>Keydown</h2>
      <input
        type="text"
        className="border p-2"
        placeholder="Press a key"
        onKeyDown={(e) => track("keydown", e.currentTarget, { key: e.key })}
      />
    </div>
  );
};

const CustomEventExample = () => {
  const { track } = useInsight();

  return (
    <div className="flex space-x-4 items-center">
      <h2>Custom Event</h2>
      <button
        onClick={() =>
          track("custom", document.body, { message: "Custom event fired" })
        }
      >
        Fire Custom Event
      </button>
    </div>
  );
};

const App = () => {
  const logger = (event: InsightEvent) => {
    console.log("[Insight Event] as recieved by your logger function", event);
  };

  return (
    <InsightProvider
      logger={logger}
      userId="demo-user"
      sessionId="session-001"
      route="/"
      devMode={true}
    >
      <div className="space-y-10">
        <div className="space-y-4">
          <h1>React Insightful - All Event Types Demo</h1>
          <p>
            Events will be logged in console <strong>twice</strong> as the
            logger function itself logs the event and also due to the fact that
            InsightProvider has <strong>devMode</strong> set to{" "}
            <strong>true</strong>
          </p>
        </div>
        <ClickExample />
        <HoverExample />
        <FocusExample />
        <InputExample />
        <ScrollExample />
        <KeydownExample />
        <CustomEventExample />
      </div>
    </InsightProvider>
  );
};

export default App;
