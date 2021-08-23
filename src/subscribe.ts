/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorRef, AnyEventObject, EventObject, spawn } from "xstate";
import { isPublishEvent } from "./publish";
import rfdc from "rfdc";
import type { StateMachineActorRef } from "./types";

export const SUBSCRIBE_EVENT = "xstate-pubsub.subscribe";
export type SubscribeEventType = typeof SUBSCRIBE_EVENT;

export const UNSUBSCRIBE_EVENT = "xstate-pubsub.unsubscribe";
export type UnsubscribeEventType = typeof UNSUBSCRIBE_EVENT;

const clone = rfdc({});

export interface SubscribeOptions {
	/**
	 * filters events by name or pattern. if not provided, all published
	 * events will be allowed through
	 *
	 * filters can be: `string`, `RegExp`, or an array of either.
	 *
	 * `*` anywhere in a string expands to the regular expression `.*`
	 * for example, `"account.*"` will become `new RegExp("^account\..*$")`
	 *
	 * all other regular expression characters in strings are escaped.
	 *
	 */
	events?: string | RegExp | (RegExp | string)[];
	/**
	 * namespace to prepend to the type of all incoming events from this subscription
	 *
	 * if the namespace is already present on the event's type, it is not added
	 */
	namespace?: string;
	/**
	 * name of the spawned subscription.
	 */
	name?: string;
}

export interface SubscribeEvent extends EventObject {
	type: SubscribeEventType;
	options?: SubscribeOptions;
}

export interface UnsubscribeEvent extends EventObject {
	type: UnsubscribeEventType;
	options?: SubscribeOptions;
}

export function subscribe<TRef extends StateMachineActorRef<any, any>>(
	ref: TRef,
	options?: SubscribeOptions,
): ActorRef<any, any> {
	ref.send({ type: SUBSCRIBE_EVENT, options });
	return spawn(
		(send) => {
			const namespace = getNamespace(options?.namespace);
			const filters = getFilters(options?.events);
			const { unsubscribe } = ref.subscribe((value) => {
				const { event } = value;
				if (isPublishEvent(event)) {
					const payload = clone(event.event);
					if (!event.event.type.startsWith(namespace)) {
						payload.type = namespace + payload.type;
					}
					if (doesMatch(payload, filters)) {
						send(payload);
					}
				}
			});
			return () => {
				send({ type: UNSUBSCRIBE_EVENT, options });
				unsubscribe();
			};
		},
		{
			name: options?.name,
		},
	);
}

function getNamespace(namespace?: string): string {
	if (!namespace) {
		return "";
	}
	if (namespace.endsWith(".")) {
		namespace = namespace.substr(0, namespace.length - 1);
	}
	if (namespace) {
		namespace = namespace + ".";
	}
	return namespace;
}

function getFilters(filters: undefined | string | RegExp | (string | RegExp)[]): RegExp[] {
	filters = filters || [];
	filters = Array.isArray(filters) ? filters : [filters];
	return filters.map((e) => {
		if (e instanceof RegExp) {
			return e;
		}
		e = "^" + e.replace(/[.+?^${}()|[\]\\]/g, "\\$&") + ".*$";
		e.replace("*", ".*");
		return new RegExp(e);
	});
}

function doesMatch(event: AnyEventObject, filters: RegExp[]): boolean {
	// if there are no filters, return true
	return !filters.length || filters.some((f) => f.test(event.type));
}
