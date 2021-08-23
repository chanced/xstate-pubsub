import {
	AnyEventObject,
	EventObject,
	ExprWithMeta,
	Event,
	SendAction,
	SendExpr,
	send,
} from "xstate";
import { isFunction } from "xstate/lib/utils";

export const PUBLISH_EVENT = "xstate-pubsub.publish";

export type PublishEventType = typeof PUBLISH_EVENT;

export type PublishExpr<TContext, TEvent extends EventObject, TEmittedEvent> = ExprWithMeta<
	TContext,
	TEvent,
	TEmittedEvent
>;

export interface PublishEvent<TEmittedEvent extends EventObject = AnyEventObject>
	extends EventObject {
	type: "emit";
	event: TEmittedEvent;
}

export function isPublishEvent(event: unknown | AnyEventObject): event is PublishEvent {
	return (
		typeof event === "object" &&
		!!event &&
		"type" in event &&
		(event as Record<string, unknown>)["type"] === PUBLISH_EVENT
	);
}

export function publish<
	TContext,
	TEvent extends EventObject,
	TEmittedEvent extends EventObject = AnyEventObject,
>(
	event: Event<TEmittedEvent> | SendExpr<TContext, TEvent, TEmittedEvent>,
): SendAction<TContext, TEvent, PublishEvent<TEmittedEvent>> {
	return send<TContext, TEvent>((ctx, e, meta) => {
		if (isFunction(event)) {
			event = event(ctx, e, meta);
		}
		return { type: PUBLISH_EVENT, event };
	}) as SendAction<TContext, TEvent, PublishEvent<TEmittedEvent>>;
}
