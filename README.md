# Poti

**Poti** é uma biblioteca robusta e fácil de usar para Inversão de Controle (IoC) em JavaScript e TypeScript. Ela permite que os desenvolvedores configurem e usem a injeção de dependência de forma simples, tornando suas aplicações mais modulares e fáceis de manter.

## Funcionalidades

- **Auto-Scanning de classes decoradas**: registre automaticamente classes com decoradores.
- **Logger integrado**: log integrado para fácil rastreamento e depuração.
- **Configuração global**: configure o contêiner globalmente para atender às suas necessidades.
- **Decoradores para propriedades e métodos**: injete dependências diretamente em propriedades e métodos.
- **Suporte a módulos e plugins**: extenda facilmente a funcionalidade do contêiner.
- **Resolução de ciclo de dependências**: evite problemas com dependências circulares.
- **Suporte a async/Await**: suporte completo para resolução de dependências assíncronas.

## Instalação

Para instalar o **Poti**, use npm ou yarn:

```bash
npm install poti
```

ou

```bash
yarn add poti
```

## Uso

### Exemplo básico

#### Criar classes com decoradores

```typescript
import 'reflect-metadata';
import { Container, Injectable, Inject } from 'poti';

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

#### Auto-Scan classes

```typescript
import { scanClasses } from 'poti';

const classesToScan = [ServiceA, ServiceB, ServiceC];
scanClasses(classesToScan);
```

#### Resolver dependências

```typescript
const container = Container.getInstance();
const serviceA = await container.resolve<ServiceA>('serviceA');
console.log(serviceA.getName());  // Output: ServiceA

const serviceB = await container.resolve<ServiceB>('serviceB');
console.log(serviceB.getServiceAName());  // Output: ServiceA

const serviceC = await container.resolve<ServiceC>('serviceC');
console.log(serviceC.getName());  // Output: ServiceC
```

### Uso avançado

#### Injeção de dependências em propriedades

```typescript
import { InjectProperty } from 'poti';

@Injectable('serviceD')
class ServiceD {
  @InjectProperty('serviceA')
  private serviceA: ServiceA;

  getServiceAName() {
    return this.serviceA.getName();
  }
}
```

#### Injeção de dependências em métodos

```typescript
import { InjectMethod } from 'poti';

@Injectable('serviceE')
class ServiceE {
  @InjectMethod('serviceA')
  initialize(serviceA: ServiceA) {
    console.log(serviceA.getName());  // Output: ServiceA
  }
}
```

#### Usando módulos e plugins

```typescript
import { Container, Module } from 'poti';

class MyModule implements Module {
  register(container: Container): void {
    container.register('serviceA', ServiceA);
    container.register('serviceB', ServiceB, 'Transient', ['serviceA']);
  }
}

const container = Container.getInstance();
container.useModule(new MyModule());
```

### Configuração global

Você pode configurar o contêiner globalmente para ajustar o comportamento dele conforme necessário.

```typescript
const container = Container.getInstance({
  logger: (message) => console.log(`[Poti] ${message}`)
});
```

## API reference

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
