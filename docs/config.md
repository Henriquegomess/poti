# Configuration Management in Poti

## Introduction

Poti supports configuration management through the `ConfigManager` class. This allows you to manage configurations for your dependencies and services via external configuration files.

## Using ConfigManager

To use the `ConfigManager`, load the configuration file in your container:

```typescript
import { Container } from 'poti';

const container = new Container();
container.loadConfig('path/to/config.json');
