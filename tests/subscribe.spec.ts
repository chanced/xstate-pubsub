import assert from "assert";
import { suite } from "uvu";
import { rootMachine } from "./fixtures";
import { interpret } from "xstate";

const subcriptions = suite("subscriptions");

subcriptions(
	"should receive all events of the ref actor if the events filter is not provided",
	() => {
		const service = interpret(rootMachine);
		service.start();
		let { context } = service.getSnapshot();
		assert.ok(context.nestedRef);
		assert.ok(context.subRef);
		assert.ok(context.subSub);
		service.send("ping");
		context = service.getSnapshot().context;
		const nested = context.nestedRef?.getSnapshot();
		assert.ok(nested);
		console.log(nested.history);
	},
);
