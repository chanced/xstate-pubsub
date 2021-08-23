xstate-pubsub / [Exports](modules.md)

# xstate-pubsub
provides publish and subscribe actions for xstate, allowing machine actors to communicate with one another.
```bash
npm install xstate-pubsub
# yarn add xstate-pubsub
```

## Usage

### Subscribing
A subscription is a specialized actor that subscribes to the target actor and listens for publish events. As such, you need to `assign` it to context:

```typescript
import { subscribe } from "xstate-pubsub"
import { createMachine, spawn } from "xstate"

const machine = createMachine({
  context: {},
  entry: [
    assign({ nestedRef: (ctx) => spawn(nestedMachine) }),
    assign({ nestedSub: (ctx) => subscribe(ctx.nestedRef) })
  ]
})
```
### Filtering events

You can filter events through options' `events` field. It accepts any one of the following: `string`, `RegExp`, `(string | RegExp)[]`.

```typescript
import { subscribe } from "xstate-pubsub"
import { createMachine, spawn } from "xstate"

const machine = createMachine({
  context: {},
  entry: [
    assign({ nestedRef: (ctx) => spawn(nestedMachine) }),
    assign({ nestedSub: (ctx) => subscribe(ctx.nestedRef, {events: "nested.example.*" }) })
  ]
})
```
strings expand `"*"` to the `RegExp` `/.*/` so the above would be expanded to the regular expression `/^nested.example\..*/`.

### Namespacing events

It is highly recommended that you namespace your events so you don't end up with collisions. 

If you have existing machines that are not namespaced, you can have one assigned with the `namespace` option.

```typescript
import { subscribe } from "xstate-pubsub"
import { createMachine, spawn } from "xstate"

const machine = createMachine({
  context: {},
  entry: [
    assign({ nestedRef: (ctx) => spawn(nestedMachine) }),
    assign({ nestedSub: (ctx) => subscribe(ctx.nestedRef, { namespace: "nested", events: "nested.example.*" }) })
  ]
})
```

## Publishing

Publishing events simply wraps your event in a `PublishEvent`. 

```typescript
  import { publish } from "xstate-pubsub"
  import { createMachine, spawn } from "xstate"

  const machine = createMachine({
    context: {},
    initial: "idle",
    idle: {
      entry: [
        publish({ type: "example", data: { name: "example" } })
      ],
    },
  })
```
would produce the following event:
```javascript 
{ 
  type: "xstate-pubsub.publish", 
  event: { type: "example", data: { name: "example "} } 
}
```

If an event is published with the same namespace as assigned in subscribers, it is not replicated on the event.

```typescript
const publisherMachine = createMachine({
  entry: [
    publish({type: "publisher.event" })
  ]
})

const subcriberMachine = createMachine({
  conetxt: {},
  entry: [
    assign({ pubRef: (ctx) => spawn(publisherMachine) }}),
    assign({ pubSub: (ctx) => subscribe(publisherMachine, {namespace: "publisher" })})
  ],
  on: {
    "publisher.event": {
      entry: log("namespace is not duplicated")
    }
  }
})
```

## Examples
**[example on codesandbox](https://codesandbox.io/s/wonderful-khayyam-4xihe?file=/src/index.ts)**
```typescript
import { publish, subscribe } from "xstate-pubsub";
import {
  createMachine,
  ActorRefFrom,
  ActorRef,
  assign,
  spawn,
  send,
  interpret
} from "xstate";
import { log } from "xstate/lib/actions";

const subMachine = createMachine({
  id: "sub",
  context: {},
  on: {
    ping: {
      actions: [log("received ping in sub"), publish({ type: "pong" })]
    }
  },
  initial: "idle",
  states: { idle: {} }
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
            events: "sub.pong",
            namespace: "sub"
          })
      })
    ],
    on: {
      "sub.pong": {
        actions: log("received pong in nested")
      }
    },
    states: {
      idle: {}
    }
  });

interface RootContext {
  subRef: ActorRefFrom<typeof subMachine>;
  nestedRef: ActorRefFrom<ReturnType<typeof createNestedMachine>>;
  subSub: ActorRef<any, any>;
}

export const rootMachine = createMachine<Partial<RootContext>>({
  id: "root",
  context: {},
  entry: [
    assign({
      subRef: (ctx) => spawn(subMachine, "sub")
    }),
    assign({
      nestedRef: (ctx) =>
        spawn(createNestedMachine({ subRef: ctx.subRef! }), "nested")
    }),
    assign({
      subSub: (ctx) =>
        subscribe(ctx.subRef, {
          events: "pong"
        })
    })
  ],
  initial: "idle",
  states: {
    idle: {
      entry: [
        (ctx) => {
          console.log(ctx);
        }
      ]
    }
  },
  on: {
    ping: {
      actions: [log("sending ping to sub"), send("ping", { to: "sub" })]
    },
    pong: {
      actions: log("received pong in root")
    }
  }
});

const service = interpret(rootMachine);
console.log("starting service");
service.start();
console.log("sending ping to root");
service.send("ping");

```
