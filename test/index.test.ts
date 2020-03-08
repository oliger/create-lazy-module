import { createLazyModule } from '../src';

test('createLazyModule', async () => {
  const originalModule = {
    lazy: jest.fn(),
  };
  const loadOriginalModuleFn = jest.fn(() => Promise.resolve(originalModule));

  const [lazyModule, loadLazyModule] = createLazyModule(loadOriginalModuleFn, [
    'lazy',
  ]);

  lazyModule.lazy('CALL_1');

  expect(originalModule.lazy.mock.calls.length).toBe(0);

  await loadLazyModule();
  await loadLazyModule();
  expect(loadOriginalModuleFn.mock.calls.length).toBe(1);

  expect(originalModule.lazy.mock.calls).toEqual([['CALL_1']]);

  lazyModule.lazy('CALL_2');

  expect(originalModule.lazy.mock.calls).toEqual([['CALL_1'], ['CALL_2']]);
});
