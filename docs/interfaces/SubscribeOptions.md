[xstate-pubsub](../README.md) / [Exports](../modules.md) / SubscribeOptions

# Interface: SubscribeOptions

## Table of contents

### Properties

- [events](SubscribeOptions.md#events)
- [name](SubscribeOptions.md#name)
- [namespace](SubscribeOptions.md#namespace)

## Properties

### events

• `Optional` **events**: `string` \| `RegExp` \| (`string` \| `RegExp`)[]

filters events by name or pattern. if not provided, all published
events will be allowed through

filters can be: `string`, `RegExp`, or an array of either.

`*` anywhere in a string expands to the regular expression `.*`
for example, `"account.*"` will become `new RegExp("^account\..*$")`

all other regular expression characters in strings are escaped.

#### Defined in

[subscribe.ts:32](https://github.com/chanced/xstate-pubsub/blob/a9ee086/src/subscribe.ts#L32)

___

### name

• `Optional` **name**: `string`

name of the spawned subscription.

#### Defined in

[subscribe.ts:42](https://github.com/chanced/xstate-pubsub/blob/a9ee086/src/subscribe.ts#L42)

___

### namespace

• `Optional` **namespace**: `string`

namespace to prepend to the type of all incoming events from this subscription

if the namespace is already present on the event's type, it is not added

#### Defined in

[subscribe.ts:38](https://github.com/chanced/xstate-pubsub/blob/a9ee086/src/subscribe.ts#L38)
