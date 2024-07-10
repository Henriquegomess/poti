# Profiling and Performance Monitoring in Poti

## Introduction

Poti includes built-in support for profiling and performance monitoring. This allows you to measure and log the performance of your dependency injections and service resolutions.

## Using Profiler

The profiler automatically logs the time taken to resolve dependencies. You can view the profiling output in the console.

```typescript
const container = new Container();

const service = await container.resolve('someService');