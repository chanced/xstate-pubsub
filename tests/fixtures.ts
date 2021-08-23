import { publish, subscribe } from "../src";
import type { ActorSub } from "../src";
import { createMachine, assign, spawn, send, ActorRefFrom } from "xstate";
import { SUBSCRIBE_EVENT, UNSUBSCRIBE_EVENT } from "../src";

interface SubContext {
	receivedPing: number;
	receivedSubscribe: number;
	receivedUnsubscribe: number;
}

export const subMachine = createMachine<SubContext>({
	id: "sub",
	context: {
		receivedPing: 0,
		receivedSubscribe: 0,
		receivedUnsubscribe: 0,
	},
	on: {
		ping: {
			actions: [publish({ type: "pong" }), assign({ receivedPing: (ctx) => ctx.receivedPing + 1 })],
		},
		[SUBSCRIBE_EVENT]: {
			actions: assign({
				receivedSubscribe: (ctx) => ctx.receivedSubscribe + 1,
			}),
		},
		[UNSUBSCRIBE_EVENT]: {
			actions: assign({
				receivedUnsubscribe: (ctx) => ctx.receivedUnsubscribe + 1,
			}),
		},
	},
	initial: "idle",
	states: { idle: {} },
});

interface NestedContext {
	subRef: ActorRefFrom<typeof subMachine>;
	subSub?: ActorSub;
	receivedPong: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createNestedMachine = (ctx: NestedContext) =>
	createMachine<NestedContext>({
		context: ctx,
		id: "nested",
		initial: "idle",
		entry: [
			assign({
				subSub: (ctx) =>
					subscribe(ctx.subRef, {
						events: "sub.pong",
						namespace: "sub",
					}),
			}),
		],
		on: {
			"sub.pong": {
				actions: [
					assign({
						receivedPong: (ctx) => ctx.receivedPong + 1,
					}),
				],
			},
		},
		states: {
			idle: {},
		},
	});

interface PingPongContext {
	subRef?: ActorRefFrom<typeof subMachine>;
	nestedRef?: ActorRefFrom<ReturnType<typeof createNestedMachine>>;
	subSub?: ActorSub;
	receivedPing: number;
	receivedPong: number;
}

export const pingPongMachine = createMachine<PingPongContext>({
	id: "root",
	context: {
		receivedPing: 0,
		receivedPong: 0,
	},
	entry: [
		assign({
			subRef: (ctx) => spawn(subMachine, "sub"),
		}),
		assign({
			nestedRef: (ctx) =>
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				spawn(createNestedMachine({ subRef: ctx.subRef!, receivedPong: 0 }), "nested"),
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
		idle: {
			entry: [],
		},
	},
	on: {
		ping: {
			actions: [
				send("ping", { to: "sub" }),
				assign({ receivedPing: (ctx) => ctx.receivedPing + 1 }),
			],
		},
		pong: {
			actions: [assign({ receivedPong: (ctx) => ctx.receivedPong + 1 })],
		},
		"stop-nested": {
			actions: (ctx) => {
				ctx.nestedRef.stop();
			},
		},
	},
});
