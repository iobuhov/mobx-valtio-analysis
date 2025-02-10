import { describe, test, assert } from 'vitest';
import { observable, autorun, computed } from 'mobx';

describe('observable.box', () => {
  test('computed can depend on box', () => {
    const box1 = observable.box(25);
    const derived = computed(() => box1.get() * 2);

    autorun(() => console.log(derived.get()));
    box1.set(100);
    assert(derived.get() === 200);
  });
});
