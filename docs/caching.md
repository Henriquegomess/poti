# Caching in Poti

## Introduction

Poti supports caching of dependency instances through the `CacheManager` class. This can improve performance by reusing instances when appropriate.

## Using CacheManager

You can cache instances and retrieve them later:

```typescript
import { Container } from 'poti';

const container = new Container();

@Injectable('myService')
class MyService {
    getData() {
        return 'data';
    }
}

const serviceInstance = await container.resolve<MyService>('myService');
container.cacheInstance('myServiceCache', serviceInstance);

const cachedInstance = container.getCachedInstance<MyService>('myServiceCache');
console.log(cachedInstance.getData()); 