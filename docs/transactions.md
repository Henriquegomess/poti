# Transactions in Poti

## Introduction

Poti supports transaction management, allowing you to manage transactional scopes for dependencies.

## Beginning a Transaction

To begin a transaction:

```typescript
import { Container } from 'poti';

const container = new Container();
container.beginTransaction('transactionId');