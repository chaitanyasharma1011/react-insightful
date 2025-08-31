# React Insightful

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/react-insightful.svg)](https://www.npmjs.com/package/react-insightful)

React Insightful is an open-source TypeScript library for tracking user interactions within React applications. It provides React components, hooks, and utilities to monitor user events such as scroll depth, clicks, and other interactions, enabling developers to gain actionable insights.

## Features

- 📊 Track user interactions like scroll depth, clicks, and custom events.
- 🛠 Easy integration via React hooks and HOCs.
- ⚡ Minimal performance overhead.
- 📝 Customizable event logging with metadata.
- 🔌 Extendable architecture for additional trackers.

## Example

You can check out a sample usage of react-insightful in the [demo app code](https://github.com/chaitanyasharma1011/react-insightful/blob/main/demo/src/App.tsx) and its [deployed UI](https://react-insightful.vercel.app/).
Since `devMode` is enabled in this example, and the `logger` function in the demo code also consoles the event, all tracked events will be logged twice in the console.

## Installation

```bash
npm install react-insightful
# or
yarn add react-insightful
```

## Quick Start

1. Wrap your app with `InsightProvider`

```tsx
import React from "react";
import { InsightProvider, InsightEvent } from "react-insightful";

function App() {
  return (
    <InsightProvider logger={(event: InsightEvent) => console.log(event)}>
      <MyPage />
    </InsightProvider>
  );
}
```

The `logger` prop is a function that receives all tracked events.
Here we’re just logging them to the console, but you could send them to an analytics service, your backend, or local storage.

2. Track events inside a component with `useInsight`.

```tsx
import React from "react";
import { useInsight } from "react-insightful";

export function Button() {
  const { track } = useInsight();

  return (
    <button
      onClick={() =>
        track("button_click", { label: "Sign Up", variant: "primary" })
      }
    >
      Sign Up
    </button>
  );
}
```

3. Example Event Payload Shape

Here’s what the logger will receive as argument:

```tsx
{
  "type": "button_click",
  "metadata": {
    "label": "Sign Up",
    "variant": "primary"
  },
  "element": "button",
  "timestamp": "2025-08-17T16:22:10.123Z",
  "context": {
    "page": "/signup"
  }
}
```

You can reaad more about `event` structure in `Event Payload Shape` section below.

## API Reference

### `<InsightProvider>`

The InsightProvider sets up a context for tracking events throughout your React application.
It wraps your app (or part of it) and provides consistent event logging with user, session, and route metadata.

**Props:**

- `logger(required)`: `(event: InsightEvent) => void` — A callback invoked whenever an event is tracked. Receives a structured event object.

- `userId (Optional)`: `string` - The ID of the currently logged-in user. Useful for associating tracked events with a user. This then gets embedded to the event , and can be used inside the logger function you provided in the above prop.

- `sessionId (Optional)`: `string` - A unique session identifier. Helps in grouping events within a single user session. This then gets embedded to the event , and can be used inside the logger function you provided in the above prop.

- `route (Optional)`: `string` - The current frontend route or page path. Allows you to analyze events per route. This then gets embedded to the event , and can be used inside the logger function you provided in the above prop.

- `devMode (Optional)`: `boolean (default = false)` - When true, events are not only passed to your logger function but also logged to the browser console in a developer-friendly format.

- `customContext (Optional)`: `object` - Any extra contextual data you want included in every tracked event. For example, tenant info, app version, or experiment flags. This then gets embedded to the event , and can be used inside the logger function you provided in the above prop.

**Example:**

```tsx
import { InsightProvider, InsightEvent } from "react-insightful";

export default function App() {
  const logger = (event: InsightEvent) => {
    console.log("%cEvent Type:", event.type.toUpperCase());
    console.log(
      "%cComponent Name:",
      `${event.componentName ?? "Unknown Component"}`
    );
    console.log("%cEvent ID:", event.id);
    console.log("%cTimestamp:", new Date(event.timeStamp).toLocaleString());

    if (event.element) {
      console.log("%cElement:", event.element);
    }

    if (event.position) {
      console.log("%cPosition:", event.position);
    }

    if (event.scrollData) {
      console.log("%cScroll Data:", event.scrollData);
    }

    if (event.metadata) {
      console.log("%cMetadata:", event.metadata);
    }

    if (event.context) {
      console.log("%cContext:", event.context);
    }
  };
  return (
    <InsightProvider
      logger={logger}
      userId="demo-user"
      sessionId="session-001"
      route="/"
      devMode={true}
    >
      <YourComponent />
    </InsightProvider>
  );
}
```

### `<ScrollTracker>`

Tracks maximum depth to which your current page (and not component,as of now) has been scrolled. The event is triggered after the page unmounts

**Props:**

- `componentName`: `string` — Name of the page to be tracked.
- `children`: `ReactNode` — Content to be tracked.

**Example:**

```tsx
import { InsightProvider, InsightEvent } from "react-insightful";

const ScrollExample = () => {
  return (
    <div className="flex flex-col space-y-4 items-start">
      <h2>
        Scroll (Event will be triggered when the bellow component unmounts)
      </h2>
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
  );
};

export default function App() {
  const logger = (event: InsightEvent) => {
    console.log("%cEvent Type:", event.type.toUpperCase());
    console.log(
      "%cComponent Name:",
      `${event.componentName ?? "Unknown Component"}`
    );
    console.log("%cEvent ID:", event.id);
    console.log("%cTimestamp:", new Date(event.timeStamp).toLocaleString());

    if (event.element) {
      console.log("%cElement:", event.element);
    }

    if (event.position) {
      console.log("%cPosition:", event.position);
    }

    if (event.scrollData) {
      console.log("%cScroll Data:", event.scrollData);
    }

    if (event.metadata) {
      console.log("%cMetadata:", event.metadata);
    }

    if (event.context) {
      console.log("%cContext:", event.context);
    }
  };
  return (
    <InsightProvider
      logger={logger}
      userId="demo-user"
      sessionId="session-001"
      route="/"
      devMode={true}
    >
      <YourComponent />
    </InsightProvider>
  );
}
```

### `useInsight()`

Hook to track events. It gives you a track function.
The track function is the core utility to log user interactions (like clicks, scrolls, hovers, etc.) in your React app. It generates a standardized event object , which is then passed on to your logger function as argument.

**Function Signature:**

```tsx
  track(
    type: InsightEventType,
    element: HTMLElement,
    metadata?: Record<string, any>,
    e?: MouseEvent | React.MouseEvent
  ): void
```

**Parameters:**

- `type`: `(InsightEventType, required)`
  The type of event you want to log. Supported types are : `"click", "hover", "focus", "input", "scroll", "keydown", "custom"`

- `element`: `(HTMLElement, optional)`
  The DOM element on which the event occurred. Used to extract details such as tag, id, class names, and a snippet of text.

- `metadata`: `(Record <string, any>, optional)`
  Additional contextual information you want to attach to the event.
  - All custom keys will be stored inside metadata.

  - If provided, the following special keys are extracted:
    - componentName → name of the React component associated with the event.

    - scrollData → object containing scroll-related information (if applicable).

  - These special keys are stored separately in the event object, and the rest remain inside metadata.

- `e`: `(MouseEvent | React.MouseEvent, optional)`
  The original browser or React synthetic event. Used to capture the mouse pointer’s position (x, y) at the time of interaction.

**Example:**

```tsx
const track = useInsight();
return (
  <div>
    {/* Click event */}
    <section>
      <h2>Click</h2>
      <button
        onClick={(e) =>
          track("click", e.currentTarget, { label: "Click Button" }, e)
        }
      >
        Click Me
      </button>
    </section>

    {/* Hover event */}
    <section>
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
      >
        Hover Over Me
      </div>
    </section>

    {/* Focus event */}
    <section>
      <h2>Focus</h2>
      <input
        type="text"
        onFocus={(e) =>
          track("focus", e.currentTarget, { label: "Input Focused" })
        }
      />
    </section>

    {/* Input event */}
    <section>
      <h2>Input</h2>
      <input
        type="text"
        onInput={(e) =>
          track("input", e.currentTarget, { value: e.currentTarget.value })
        }
      />
    </section>

    {/* Keydown event */}
    <section>
      <h2>Keydown</h2>
      <input
        type="text"
        placeholder="Press a key"
        onKeyDown={(e) => track("keydown", e.currentTarget, { key: e.key })}
      />
    </section>

    {/* Custom event */}
    <div className="flex space-x-4 items-center">
      <h2>Custom Event</h2>
      <button
        onClick={(e) =>
          track("custom", e.currentTarget, { message: "Custom event fired" })
        }
      >
        Fire Custom Event
      </button>
    </div>
  </div>
);
```

### `withInsight HOC`

The `withInsight` higher-order component (HOC) is a utility that makes it easier to integrate event tracking into your React components without manually wiring up the `useInsight` hook each time.

It automatically injects the `track` function into your component’s props so you can start logging interactions (clicks, scrolls, etc.) with minimal setup.

**Usage:**

```tsx
import React from "react";
import { withInsight } from "react-insightful";

interface ButtonProps {
  label: string;
  // `track` will be automatically injected by withInsight
  track: (
    type: string,
    element: HTMLElement,
    metadata?: Record<string, any>,
    e?: MouseEvent | React.MouseEvent
  ) => void;
}

const Button: React.FC<ButtonProps> = ({ label, track }) => {
  return (
    <button
      onClick={(e) =>
        track("click", e.currentTarget, { componentName: "Button" }, e)
      }
    >
      {label}
    </button>
  );
};

// Wrap your component with `withInsight`
export default withInsight(Button);
```

**Example: Consuming a Wrapped Component**
Once a component is wrapped with `withInsight`, you can use it just like a normal React component , no need to pass the `track` function manually.

```tsx
import React from "react";
import { InsightProvider } from "react-insightful";
import TrackedButton from "./Button"; // wrapped withInsight(Button)

function App() {
  return (
    <InsightProvider logger={(event) => console.log("Event logged:", event)}>
      <div>
        <h1>withInsight Example</h1>
        <TrackedButton label="Click Me 🚀" />
      </div>
    </InsightProvider>
  );
}

export default App;
```

## Event Payload Shape

Every tracked interaction generates a structured event object that is passed to your `logger` function inside `InsightProvider`.

### Example Payload

```ts
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  type: "click",
  timeStamp: 1734493020123,
  element: {
    tagName: "BUTTON",
    text: "Submit",
    attributes: { class: "btn-primary" }
  },
  position: { x: 120, y: 450 },
  componentName: "SubmitButton",
  scrollData: undefined,
  context: { userId: "123", page: "/checkout" },
  metadata: { customKey: "customValue" }
}
```

### Field Reference

- id → Unique identifier for the event

- type → Type of interaction (e.g., click, scroll)

- timeStamp → UNIX timestamp of when the event occurred

- element → DOM element details (tag, text, attributes)

- position → Cursor position at the time of interaction (if applicable)

- componentName → React component name (if provided in metadata)

- scrollData → Scroll-specific data (from ScrollTracker)

- context → Global context passed from InsightProvider

- metadata → Custom data you attach when tracking the event

<!-- ## Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/chaitanyasharma1011/react-insightful.git
cd react-insightful
npm install
```

Run the example app:

```bash
npm run dev
```

Build the library:

```bash
npm run build
``` -->

## Roadmap

- [x] Add click tracker
- [x] Add scroll tracker
- [ ] Add time-on-page tracker
- [ ] Add heatmap visualization
- [ ] Integrate analytics dashboard

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Inspiration

React Insightful was inspired by the need for a lightweight, developer-friendly solution for tracking user engagement without relying on heavy analytics libraries.
