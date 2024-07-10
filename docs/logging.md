# Advanced Logging in Poti

## Introduction

Poti includes built-in support for advanced logging using the `winston` logging library. This allows you to log information and errors throughout the dependency injection lifecycle.

## Logging Information

You can log information using the `logInfo` function:

```typescript
import { logInfo } from 'poti';

logInfo('This is an info message');
