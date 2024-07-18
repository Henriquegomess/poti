# Poti

**Poti** é uma biblioteca robusta e fácil de usar para Inversão de Controle (IoC) em JavaScript e TypeScript. Ela permite que os desenvolvedores configurem e usem a injeção de dependência de forma simples, tornando suas aplicações mais modulares e fáceis de manter.

## Funcionalidades

- **Auto-Scanning de Classes Decoradas**: Registre automaticamente classes com decoradores.
- **Logger Integrado**: Log integrado para fácil rastreamento e depuração.
- **Configuração Global**: Configure o contêiner globalmente para atender às suas necessidades.
- **Decoradores para Propriedades e Métodos**: Injete dependências diretamente em propriedades e métodos.
- **Suporte a Módulos e Plugins**: Extenda facilmente a funcionalidade do contêiner.
- **Resolução de Ciclo de Dependências**: Evite problemas com dependências circulares.
- **Suporte a Async/Await**: Suporte completo para resolução de dependências assíncronas.

## Instalação

Para instalar o **Poti**, use npm ou yarn:

```bash
npm install poti-ioc
```

ou

```bash
yarn add poti-ioc
```

## Uso

### Exemplo Básico

#### Criar Classes com Decoradores

```typescript
import 'reflect-metadata';
import { Container, Injectable, Inject } from 'poti-ioc';

@Injectable('serviceA')
class ServiceA {
  getName() {
    return 'ServiceA';
  }
}

@Injectable('serviceB', 'Transient', ['serviceA'])
class ServiceB {
  constructor(public serviceA: ServiceA) {}

  getServiceAName() {
    return this.serviceA.getName();
  }
}

@Injectable('serviceC', 'Singleton')
class ServiceC {
  constructor() {
    console.log('ServiceC initialized');
  }

  getName() {
    return 'ServiceC';
  }
}
```

#### Auto-Scan Classes

```typescript
import { scanClasses } from 'poti-ioc';

const classesToScan = [ServiceA, ServiceB, ServiceC];
scanClasses(classesToScan);
```

#### Resolver Dependências

```typescript
const container = Container.getInstance();
const serviceA = await container.resolve<ServiceA>('serviceA');
console.log(serviceA.getName());  // Output: ServiceA

const serviceB = await container.resolve<ServiceB>('serviceB');
console.log(serviceB.getServiceAName());  // Output: ServiceA

const serviceC = await container.resolve<ServiceC>('serviceC');
console.log(serviceC.getName());  // Output: ServiceC
```

### Uso Avançado

#### Injeção de Dependências em Propriedades

```typescript
import { InjectProperty } from 'poti-ioc';

@Injectable('serviceD')
class ServiceD {
  @InjectProperty('serviceA')
  private serviceA: ServiceA;

  getServiceAName() {
    return this.serviceA.getName();
  }
}
```

#### Injeção de Dependências em Métodos

```typescript
import { InjectMethod } from 'poti-ioc';

@Injectable('serviceE')
class ServiceE {
  @InjectMethod('serviceA')
  initialize(serviceA: ServiceA) {
    console.log(serviceA.getName());  // Output: ServiceA
  }
}
```

#### Usando Módulos e Plugins

```typescript
import { Container, Module } from 'poti-ioc';

class MyModule implements Module {
  register(container: Container): void {
    container.register('serviceA', ServiceA);
    container.register('serviceB', ServiceB, 'Transient', ['serviceA']);
  }
}

const container = Container.getInstance();
container.useModule(new MyModule());
```

### Configuração Global

Você pode configurar o contêiner globalmente para ajustar o comportamento dele conforme necessário.

```typescript
const container = Container.getInstance({
  logger: (message) => console.log(`[Poti] ${message}`)
});
```

## API Reference

### `@Injectable`

Decorador para registrar uma classe como dependência.

#### Parâmetros

- `name` (string): O nome da dependência.
- `scope` (Scope): O escopo da dependência. O padrão é "Transient".
- `dependencies` (string[]): As dependências da classe. O padrão é um array vazio.
- `onInit` (function): Função a ser chamada na inicialização.
- `onDestroy` (function): Função a ser chamada na destruição.

### `@Inject`

Decorador para injetar uma dependência em uma propriedade.

#### Parâmetros

- `name` (string): O nome da dependência a ser injetada.

### `@InjectProperty`

Decorador para injetar uma dependência em uma propriedade.

#### Parâmetros

- `name` (string): O nome da dependência a ser injetada.

### `@InjectMethod`

Decorador para injetar uma dependência em um método.

#### Parâmetros

- `name` (string): O nome da dependência a ser injetada.

### `scanClasses`

Função para auto-scan e registro de classes decoradas.

#### Parâmetros

- `classes` (Function[]): Array de classes a serem escaneadas.

### Métodos do Container

#### `getInstance(options?: ContainerOptions): Container`

Obtenha a instância singleton do contêiner.

#### `register`

Registre uma classe como dependência.

#### `registerFactory`

Registre uma função de fábrica como dependência.

#### `registerAsyncFactory`

Registre uma função de fábrica assíncrona como dependência.

#### `registerValue`

Registre um valor como dependência.

#### `resolve`

Resolva uma dependência.

#### `use`

Use um middleware.

#### `useModule`

Use um módulo para registrar dependências.

#### `usePlugin`

Use um plugin para estender a funcionalidade.
