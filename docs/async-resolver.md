# Asynchronous Resolution in Poti

## Introduction

Poti supports asynchronous resolution of dependencies, allowing for parallel resolution.

## Resolving Dependencies Asynchronously

Dependencies can be resolved asynchronously using the `AsyncResolver`:

```typescript
import { AsyncResolver } from 'poti';

const asyncResolver = new AsyncResolver();
const resolvedDependencies = await asyncResolver.resolveDependencies(['dep1', 'dep2'], dep => container.resolve(dep));