// const subMachine = createModel(
//     {
//       payload: "payload"
//     },
//     {
//       events: {
//         emit: (event: AnyEventObject) => ({ event }),
//         ping: () => ({})
//       }
//     }
//   ).createMachine({
//     id: "sub",
//     on: {
//       emit: {
//         actions: (_, event) => {
//           console.log("emitting from sub:", event.event);
//         }
//       },
//       ping: {
//         actions: [
//           emit((ctx) => ({
//             type: "pong",
//             payload: ctx.payload
//           })),
//           log("received ping in sub")
//         ]
//       }
//     },
//     initial: "idle",
//     states: { idle: {} }
//   });

//   const createNestedMachine = (ctx: {
//     subRef: ActorRefFrom<typeof subMachine>;
//     subMonitor?: ActorRef<any, any>;
//   }) =>
//     createModel(ctx, {
//       events: {
//         pong: (value: string) => ({ value })
//       }
//     }).createMachine({
//       id: "nested",
//       initial: "idle",
//       entry: [
//         assign({
//           subMonitor: (ctx) =>
//             subscribe(ctx.subRef, {
//               events: ["pong"]
//             })
//         })
//       ],
//       on: {
//         pong: {
//           actions: (ctx, event) => {
//             console.log("received pong in nested");
//           }
//         }
//       },
//       states: {
//         idle: {}
//       }
//     });

//   export const rootMachine = createModel(
//     {
//       nestedRef: undefined as
//         | ActorRefFrom<ReturnType<typeof createNestedMachine>>
//         | undefined,
//       subRef: undefined as ActorRefFrom<typeof subMachine> | undefined,
//       subMonitor: undefined as ActorRef<any, any> | undefined
//     },
//     {
//       events: {
//         ping: () => ({}),
//         pong: () => ({})
//       }
//     }
//   ).createMachine({
//     id: "root",
//     entry: [
//       assign({
//         subRef: (ctx) => spawn(subMachine, "sub")
//       }),
//       assign({
//         nestedRef: (ctx) =>
//           spawn(createNestedMachine({ subRef: ctx.subRef! }), "nested")
//       }),
//       assign({
//         subMonitor: (ctx) =>
//           subscribe(ctx.subRef, {
//             events: "pong"
//           })
//       })
//     ],
//     initial: "idle",
//     states: {
//       idle: {}
//     },
//     on: {
//       ping: {
//         actions: [log("sending ping to sub"), send("ping", { to: "sub" })]
//       },
//       pong: {
//         actions: log("received pong in root")
//       }
//     }
//   });

//   const service = interpret(rootMachine);
//   console.log("starting service");
//   service.start();
//   console.log("sending ping to root");
//   service.send("ping");
