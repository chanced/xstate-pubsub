[xstate-pubsub](README.md) / Exports

# xstate-pubsub

## Table of contents

### Interfaces

- [PublishEvent](interfaces/PublishEvent.md)
- [SubscribeEvent](interfaces/SubscribeEvent.md)
- [SubscribeOptions](interfaces/SubscribeOptions.md)
- [UnsubscribeEvent](interfaces/UnsubscribeEvent.md)

### Type aliases

- [ActorSub](modules.md#actorsub)
- [PublishEventType](modules.md#publisheventtype)
- [PublishExpr](modules.md#publishexpr)
- [StateMachineActorRef](modules.md#statemachineactorref)
- [SubscribeEventType](modules.md#subscribeeventtype)
- [UnsubscribeEventType](modules.md#unsubscribeeventtype)

### Variables

- [PUBLISH\_EVENT](modules.md#publish_event)
- [SUBSCRIBE\_EVENT](modules.md#subscribe_event)
- [UNSUBSCRIBE\_EVENT](modules.md#unsubscribe_event)

### Functions

- [isPublishEvent](modules.md#ispublishevent)
- [publish](modules.md#publish)
- [subscribe](modules.md#subscribe)

## Type aliases

### ActorSub

Ƭ **ActorSub**: `ActorRef`<`any`, `any`\>

#### Defined in

[subscribe.ts:9](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/subscribe.ts#L9)

___

### PublishEventType

Ƭ **PublishEventType**: typeof [`PUBLISH_EVENT`](modules.md#publish_event)

#### Defined in

[publish.ts:14](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/publish.ts#L14)

___

### PublishExpr

Ƭ **PublishExpr**<`TContext`, `TEvent`, `TEmittedEvent`\>: `ExprWithMeta`<`TContext`, `TEvent`, `TEmittedEvent`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContext` | `TContext` |
| `TEvent` | extends `EventObject` |
| `TEmittedEvent` | `TEmittedEvent` |

#### Defined in

[publish.ts:16](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/publish.ts#L16)

___

### StateMachineActorRef

Ƭ **StateMachineActorRef**<`M`, `S`\>: `ActorRef`<`M`, `S`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `StateMachine`<`any`, `any`, `any`\>`StateMachine`<`any`, `any`, `any`\> |
| `S` | extends `State`<`any`\>`State`<`any`\> |

#### Defined in

[types.ts:4](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/types.ts#L4)

___

### SubscribeEventType

Ƭ **SubscribeEventType**: typeof [`SUBSCRIBE_EVENT`](modules.md#subscribe_event)

#### Defined in

[subscribe.ts:12](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/subscribe.ts#L12)

___

### UnsubscribeEventType

Ƭ **UnsubscribeEventType**: typeof [`UNSUBSCRIBE_EVENT`](modules.md#unsubscribe_event)

#### Defined in

[subscribe.ts:15](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/subscribe.ts#L15)

## Variables

### PUBLISH\_EVENT

• `Const` **PUBLISH\_EVENT**: ``"xstate-pubsub.publish"``

#### Defined in

[publish.ts:12](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/publish.ts#L12)

___

### SUBSCRIBE\_EVENT

• `Const` **SUBSCRIBE\_EVENT**: ``"xstate-pubsub.subscribe"``

#### Defined in

[subscribe.ts:11](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/subscribe.ts#L11)

___

### UNSUBSCRIBE\_EVENT

• `Const` **UNSUBSCRIBE\_EVENT**: ``"xstate-pubsub.unsubscribe"``

#### Defined in

[subscribe.ts:14](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/subscribe.ts#L14)

## Functions

### isPublishEvent

▸ **isPublishEvent**(`event`): event is PublishEvent<AnyEventObject\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `unknown` \| `AnyEventObject` |

#### Returns

event is PublishEvent<AnyEventObject\>

#### Defined in

[publish.ts:28](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/publish.ts#L28)

___

### publish

▸ **publish**<`TContext`, `TEvent`, `TEmittedEvent`\>(`event`): `SendAction`<`TContext`, `TEvent`, [`PublishEvent`](interfaces/PublishEvent.md)<`TEmittedEvent`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContext` | `TContext` |
| `TEvent` | extends `EventObject` |
| `TEmittedEvent` | extends `EventObject``AnyEventObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event`<`TEmittedEvent`\> \| `SendExpr`<`TContext`, `TEvent`, `TEmittedEvent`\> |

#### Returns

`SendAction`<`TContext`, `TEvent`, [`PublishEvent`](interfaces/PublishEvent.md)<`TEmittedEvent`\>\>

#### Defined in

[publish.ts:37](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/publish.ts#L37)

___

### subscribe

▸ **subscribe**<`TRef`\>(`to`, `options?`): `ActorRef`<`any`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRef` | extends `ActorRef`<`any`, `any`, `TRef`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `TRef` |
| `options?` | [`SubscribeOptions`](interfaces/SubscribeOptions.md) |

#### Returns

`ActorRef`<`any`, `any`\>

#### Defined in

[subscribe.ts:55](https://github.com/chanced/xstate-pubsub/blob/a2164ac/src/subscribe.ts#L55)
