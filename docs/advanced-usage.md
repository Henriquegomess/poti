# Advanced Usage of Poti

## Middleware

Middleware allows you to intercept and modify instances during the resolution process. This can be useful for logging, authentication, or modifying instances.

```typescript
import { Middleware } from 'poti';

const loggingMiddleware: Middleware = (instance, context) => {
    console.log('Resolving:', instance);
    return instance;
};

const container = new Container();
container.use(loggingMiddleware);

@Injectable('serviceA')
class ServiceA {
    getName() {
        return 'ServiceA';
    }
}

const serviceA = await container.resolve<ServiceA>('serviceA');