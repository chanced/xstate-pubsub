# xstate-pubsub
actions that allow xstate machines to emit and subscribe to other machine actors

```bash
npm install xstate-pubsub
# yarn add xstate-pubsub
```

## Usage
```typescript
import { publish, subscribe } from "xstate-pubsub";
import {
  createMachine,
  ActorRefFrom,
  ActorRef,
  assign,
  spawn,
  send,
  interpret,
  Actor,
} from "xstate";
import { log } from "xstate/lib/actions";

const subMachine = createMachine({
  id: "sub",
  on: {
    ping: {
      actions: [log("received ping in sub"), publish({ type: "pong" })],
    },
  },
  initial: "idle",
  states: { idle: {} },
});

interface NestedContext {
  subRef: ActorRefFrom<typeof subMachine>;
  subSub?: ActorRef<any, any>;
}

const createNestedMachine = (ctx: NestedContext) =>
  createMachine<NestedContext>({
    context: ctx,
    id: "nested",
    initial: "idle",
    entry: [
      assign({
        subSub: (ctx) =>
          subscribe(ctx.subRef, {
            events: "pong",
          }),
      }),
    ],
    on: {
      pong: {
        actions: log("received pong in nested"),
      },
    },
    states: {
      idle: {},
    },
  });

interface RootContext {
  subRef: ActorRefFrom<typeof subMachine>;
  nestedRef: ActorRefFrom<ReturnType<typeof createNestedMachine>>;
  subSub: ActorRef<any, any>;
}

export const rootMachine = createMachine<RootContext>({
  id: "root",
  entry: [
    assign({
      subRef: (ctx) => spawn(subMachine, "sub"),
    }),
    assign({
      nestedRef: (ctx) => spawn(createNestedMachine({ subRef: ctx.subRef! }), "nested"),
    }),
    assign({
      subSub: (ctx) =>
        subscribe(ctx.subRef, {
          events: "pong",
        }),
    }),
  ],
  initial: "idle",
  states: {
    idle: {},
  },
  on: {
    ping: {
      actions: [log("sending ping to sub"), send("ping", { to: "sub" })],
    },
    pong: {
      actions: log("received pong in root"),
    },
  },
});

const service = interpret(rootMachine);
console.log("starting service");
service.start();
console.log("sending ping to root");
service.send("ping");

```