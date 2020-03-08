type OriginalModule = { [index: string]: any };

type ProxyModuleValue<T extends any> = T extends (...args: any) => any
  ? (...args: Parameters<T>) => Promise<ReturnType<T>>
  : () => Promise<T>;

type ProxyModule<T extends OriginalModule> = {
  [P in keyof T]: ProxyModuleValue<T[P]>;
};

type LazyModule<T extends OriginalModule, K extends keyof T> = Pick<
  ProxyModule<T>,
  K
>;

export const createLazyModule = <T extends OriginalModule, K extends keyof T>(
  loadModule: () => Promise<T>,
  methodNames: readonly K[]
): [LazyModule<T, K>, () => Promise<void>] => {
  let _module: T | null = null;
  let _queue: (() => void)[] = [];

  const loadModuleAndDequeue = () => {
    if (_module) return Promise.resolve();

    return loadModule().then(m => {
      _module = m;

      while (_queue.length > 0) {
        const run = _queue.shift()!;
        run();
      }
    });
  };

  const lazyModule = {} as any;
  methodNames.forEach(k => {
    lazyModule[k] = (...args: any) => {
      return new Promise(resolve => {
        const run = () => {
          const value = _module![k];
          const r = typeof value === 'function' ? value(...args) : value;
          resolve(r);
        };

        // Run now if module is loaded.
        if (_module) return run();

        // Run later otherwise.
        _queue.push(run);
      });
    };
  });

  return [lazyModule, loadModuleAndDequeue];
};
