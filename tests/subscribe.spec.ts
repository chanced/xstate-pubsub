import assert from "assert";
import { suite } from "uvu";
import { pingPongMachine } from "./fixtures";
import { interpret } from "xstate";

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
subscriber.run();
