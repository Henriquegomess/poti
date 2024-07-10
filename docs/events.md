# Events in Poti

## Introduction

The event system in Poti allows you to emit and listen to events within your IoC container. This can be useful for decoupling components and creating reactive architectures.

## Emitting Events

To emit an event, use the `emit` method of the `Container` class:

```typescript
const container = new Container();

container.emit('eventName', { key: 'value' });
