/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActorRef, State, StateMachine } from "xstate";

export type StateMachineActorRef<
	M extends StateMachine<any, any, any> = StateMachine<any, any, any>,
	S extends State<any> = State<any>,
> = ActorRef<M, S>;

// export type StateMachineActorRef<
//   TContext,
//   TEvent extends EventObject = EventObject,
//   TMachine extends StateMachine<TContext, unknown, TEvent> = StateMachine<
//     TContext,
//     TStateSchema,
//     TEvent
//   >,
//   TState extends State<TContext, TEvent, TStateSchema> = State<
//     TContext,
//     TEvent,
//     TStateSchema
//   >
// > = ActorRef<TMachine, TState>;
