# Plugins in Poti

## Introduction

Plugins allow you to extend the functionality of Poti. You can use plugins to add new features, integrate with other libraries, or customize the behavior of the container.

## Creating a Plugin

A plugin is an object that implements the `Plugin` interface. The `install` method is called when the plugin is used in a container.

```typescript
import { Container, Plugin } from 'poti';

class MyPlugin implements Plugin {
    install(container: Container): void {
        container.on('eventName', (event, payload) => {
            console.log('MyPlugin received event:', event, payload);
        });
    }
}

const container = new Container();
const plugin = new MyPlugin();

container.usePlugin(plugin);
container.emit('eventName', { key: 'value' });