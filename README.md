# Create Lazy Module

Create lazy module that enqueue calls while the original module is loading and dequeue calls when it is loaded.

[Example](https://codesandbox.io/s/create-lazy-module-z6ces?fontsize=14&hidenavigation=1&theme=dark)

## Installation

```sh
yarn add create-lazy-module
```

## API

```js
import { createLazyModule } from 'create-lazy-module';

const loadOriginalModule = () => import('./analytics');
const methodNames = ['track'];

const [lazyModule, loadModule] = createLazyModule(
  loadOriginalModule,
  methodNames
);
```

### Parameters

- **`loadOriginalModule`:** `() => Promise<OriginalModule>`, Returns a Promise resolving with the original module.
- **`methodNames`:** `string[]`, Methods that are available on the lazy module.

### Return

- **`lazyModule`:** `LazyModule`, Lazy module with methods defined in `methodNames`.
- **`loadModule`:** `() => Promise<void>`, Loads the original module and dequeue calls.
