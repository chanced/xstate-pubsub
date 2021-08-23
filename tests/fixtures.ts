import { publish, subscribe } from "../src";
import type { ActorSub } from "../src";
import { createMachine, assign, spawn, send, ActorRefFrom } from "xstate";
import { log } from "xstate/lib/actions";

export const subMachine = createMachine({
	id: "sub",
	context: {},
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
	subSub?: ActorSub;
}

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
				actions: log("received pong in nested"),
			},
		},
		states: {
			idle: {},
		},
	});

interface RootContext {
	subRef?: ActorRefFrom<typeof subMachine>;
	nestedRef?: ActorRefFrom<ReturnType<typeof createNestedMachine>>;
	subSub?: ActorSub;
}

export const rootMachine = createMachine<RootContext>({
	id: "root",
	context: {},
	entry: [
		assign({
			subRef: (ctx) => spawn(subMachine, "sub"),
		}),
		assign({
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
		idle: {
			entry: [
				(ctx) => {
					console.log(ctx);
				},
			],
		},
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
