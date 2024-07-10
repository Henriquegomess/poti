# Security in Poti

## Introduction

Poti includes built-in security features to protect against malicious dependency injection and validate inputs.

## Allowing and Validating Types

You can specify which types are allowed for dependency injection:

```typescript
import { SecurityManager } from 'poti';

const securityManager = new SecurityManager();
securityManager.allowType('myService');
