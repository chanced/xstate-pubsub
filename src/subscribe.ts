/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actor, ActorRef, AnyEventObject, EventObject, spawn } from "xstate";
import { isPublishEvent } from "./publish";
import rfdc from "rfdc";
import type { StateMachineActorRef } from "./types";
import type { PublishEvent } from "src";

// TODO: improve this
export type ActorSub = ActorRef<any, any>;

export const SUBSCRIBE_EVENT = "xstate-pubsub.subscribe";
export type SubscribeEventType = typeof SUBSCRIBE_EVENT;

export const UNSUBSCRIBE_EVENT = "xstate-pubsub.unsubscribe";
export type UnsubscribeEventType = typeof UNSUBSCRIBE_EVENT;

const copy = rfdc();

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
	to: TRef,
	options?: SubscribeOptions,
): ActorRef<any, any> {
	to.send({ type: SUBSCRIBE_EVENT, options });
	return spawn(
		(send) => {
			const namespace = getNamespace(options?.namespace);
			const filters = getFilters(options?.events);
			const { unsubscribe } = to.subscribe((value) => {
				const { event } = value;
				if (isPublishEvent(event)) {
					if (doesMatch(event, filters, namespace)) {
						const type = namespaceType(event.event, namespace);
						send({ ...copy(event.event), type });
					}
				}
			});
			return () => {
				const { done }: { done: boolean } = to.getSnapshot();
				if (!done) {
					to.send({ type: UNSUBSCRIBE_EVENT, options });
				}
				unsubscribe();
			};
		},
		{
			name: options?.name,
		},
	);
}

function namespaceType(event: AnyEventObject, namespace: string): string {
	return namespace + event.type;
}

function typeMatchesFilters(type: string, filters: RegExp[]): boolean {
	return filters.some((f) => f.test(type));
}

function doesMatch(event: PublishEvent, filters: RegExp[], namespace: string): boolean {
	// if there are no filters, return true
	if (!filters.length) {
		return true;
	}
	if (typeMatchesFilters(event.event.type, filters)) {
		return true;
	}
	// allows for filters to contain either the namepsaced filter or the source
	// so { of: "ping", namespace: "account" } will still match
	return (
		!!namespace &&
		!isNamespaced(event, namespace) &&
		typeMatchesFilters(namespaceType(event.event, namespace), filters)
	);
}

function isNamespaced(event: PublishEvent, namespace: string): boolean {
	return event.event.type.startsWith(namespace);
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
