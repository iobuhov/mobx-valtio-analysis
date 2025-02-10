import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { action, makeObservable, observable, reaction } from 'mobx';
import { proxy, subscribe, ref } from 'valtio/vanilla';
import { subscribeKey } from 'valtio/vanilla/utils';

describe('mobx', () => {
  const createState = (count = 0) => ({
    count,
    inc() {
      this.count++;
    },
    setCount(value: number) {
      this.count = value;
    },
  });

  let state = createState();

  beforeEach(() => {
    state = makeObservable(createState(), {
      count: observable,
      inc: action,
      setCount: action,
    });
  });

  test('expect no prior changes', () => {
    expect(state.count).toBe(0);
  });

  test('change trigger reaction synchronously', () => {
    let n = 0;
    const dispose = reaction(
      () => state.count,
      () => n++
    );

    state.inc();
    expect(n).toBe(1);

    state.inc();
    expect(n).toBe(2);

    state.inc();
    expect(n).toBe(3);
    dispose();
  });

  test("settings same value don't trigger reaction", () => {
    let n = 0;
    const dispose = reaction(
      () => state.count,
      () => n++
    );

    state.setCount(0);
    state.setCount(0);
    state.setCount(0);
    expect(n).toBe(0);
    dispose();
  });
});

describe('valtio', () => {
  const createState = (count = 0) => ({
    count,
    inc() {
      this.count++;
    },
    setCount(value: number) {
      this.count = value;
    },
  });

  let state = createState();

  beforeEach(() => {
    state = proxy(createState());
  });

  test('expect no prior changes', () => {
    expect(state.count).toBe(0);
  });

  test('multiple changes trigger only single subscribe callback', async () => {
    let n = 0;
    const unsub = subscribe(state, () => n++);

    state.inc();
    expect(n).toBe(0);

    state.inc();
    expect(n).toBe(0);

    state.inc();
    expect(n).toBe(0);

    await Promise.resolve();
    expect(n).toBe(1);
    unsub();
  });

  test('multiple changes can trigger subscribe multiple times if batching is disabled', async () => {
    let n = 0;
    const unsub = subscribe(state, () => n++, true);

    state.inc();
    expect(n).toBe(1);

    state.inc();
    expect(n).toBe(2);

    state.inc();
    expect(n).toBe(3);

    unsub();
  });

  test('change trigger subscribeKey in sync? (no)', async () => {
    let n = 0;
    const unsub = subscribeKey(state, 'count', () => n++);

    state.inc();
    expect(n).toBe(0);

    state.inc();
    expect(n).toBe(0);

    state.inc();
    expect(n).toBe(0);

    await Promise.resolve();
    expect(n).toBe(1);
    unsub();
  });
});
