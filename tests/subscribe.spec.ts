import assert from "assert";
import { suite } from "uvu";
import { pingPongMachine } from "./fixtures";
import { assign, createMachine, interpret, spawn } from "xstate";
import { publish, subscribe } from "../src";

export const subscriber = suite("subscriptions");

subscriber(
	"should receive all events of the ref actor if the events filter is not provided",
	() => {
		const service = interpret(pingPongMachine);
		service.start();
		service.send("ping");
		service.stop();
		const { context } = service.getSnapshot();
		const { nestedRef, subRef } = context;
		const { context: nestedContext } = nestedRef.getSnapshot();
		const { context: subContext } = subRef.getSnapshot();
		assert.equal(context.receivedPing, 1);
		assert.equal(context.receivedPong, 1);
		assert.equal(nestedContext.receivedPong, 1);
		assert.equal(subContext.receivedPing, 1);
	},
);

subscriber("should send an 'xstate-pubsub-subscribe' event upon subscription", () => {
	const service = interpret(pingPongMachine);
	service.start();
	const { context } = service.getSnapshot();
	const { subRef } = context;

	const { context: subContext } = subRef.getSnapshot();
	service.send("stop-nested");
	service.stop();
	assert.equal(subContext.receivedSubscribe, 2);

	// TODO: Fix unsubscribe events
	// assert.equal(subContext.receivedUnsubscribe, 1);
});

subscriber("should match wildcard events", () => {
	const events = [
		"namespaced.example.foo",
		"namespaced.example.bar",
		"namespaced.example.baz",
		"namespaced.example.foobar",
		"example.foobar",
	];

	const actions = () => events.map((e) => publish(e));

	const eventRes: Record<string, boolean> = {};
	const nodes = events.reduce((acc, cur) => {
		acc[cur] = {
			actions: () => {
				eventRes[cur] = true;
			},
		};
		return acc;
	}, {} as Record<string, unknown>);

	const emitter = createMachine({
		entry: actions(),
	});

	const machine = createMachine({
		on: nodes,
		context: {},
		entry: [
			assign({ ref: spawn(emitter) }),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			assign((ctx: any) =>
				subscribe(ctx.ref, {
					namespace: "namespaced",
					events: ["namespaced.*.foo"],
				}),
			),
		],
	});
	const svc = interpret(machine);
	svc.start();
});

subscriber.run();
