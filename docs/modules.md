[xstate-pubsub](README.md) / Exports

# xstate-pubsub

## Table of contents

### Interfaces

- [PublishEvent](interfaces/PublishEvent.md)
- [SubscribeEvent](interfaces/SubscribeEvent.md)
- [SubscribeOptions](interfaces/SubscribeOptions.md)
- [UnsubscribeEvent](interfaces/UnsubscribeEvent.md)

### Type aliases

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

### PublishEventType

Ƭ **PublishEventType**: typeof [`PUBLISH_EVENT`](modules.md#publish_event)

#### Defined in

[publish.ts:14](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/publish.ts#L14)

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

[publish.ts:16](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/publish.ts#L16)

___

### StateMachineActorRef

Ƭ **StateMachineActorRef**<`M`, `S`\>: `ActorRef`<`M`, `S`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `StateMachine`<`any`, `any`, `any`\>`StateMachine`<`any`, `any`, `any`\> |
| `S` | extends `State`<`any`\>`State`<`any`\> |

#### Defined in

[types.ts:4](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/types.ts#L4)

___

### SubscribeEventType

Ƭ **SubscribeEventType**: typeof [`SUBSCRIBE_EVENT`](modules.md#subscribe_event)

#### Defined in

[subscribe.ts:8](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/subscribe.ts#L8)

___

### UnsubscribeEventType

Ƭ **UnsubscribeEventType**: typeof [`UNSUBSCRIBE_EVENT`](modules.md#unsubscribe_event)

#### Defined in

[subscribe.ts:11](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/subscribe.ts#L11)

## Variables

### PUBLISH\_EVENT

• `Const` **PUBLISH\_EVENT**: ``"xstate-pubsub.publish"``

#### Defined in

[publish.ts:12](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/publish.ts#L12)

___

### SUBSCRIBE\_EVENT

• `Const` **SUBSCRIBE\_EVENT**: ``"xstate-pubsub.subscribe"``

#### Defined in

[subscribe.ts:7](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/subscribe.ts#L7)

___

### UNSUBSCRIBE\_EVENT

• `Const` **UNSUBSCRIBE\_EVENT**: ``"xstate-pubsub.unsubscribe"``

#### Defined in

[subscribe.ts:10](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/subscribe.ts#L10)

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

[publish.ts:28](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/publish.ts#L28)

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

[publish.ts:37](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/publish.ts#L37)

___

### subscribe

▸ **subscribe**<`TRef`\>(`ref`, `options?`): `ActorRef`<`any`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRef` | extends `ActorRef`<`any`, `any`, `TRef`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `TRef` |
| `options?` | [`SubscribeOptions`](interfaces/SubscribeOptions.md) |

#### Returns

`ActorRef`<`any`, `any`\>

#### Defined in

[subscribe.ts:51](https://github.com/chanced/xstate-pubsub/blob/c5c0724/src/subscribe.ts#L51)
