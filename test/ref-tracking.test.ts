import { describe, expect, test, vi } from 'vitest';
import { ref, proxy, subscribe } from 'valtio/vanilla';

describe('valtio', () => {
  test('ref is pure? (yes)', () => {
    const obj = Object.freeze({});
    expect(ref(obj)).toBe(ref(obj));
  });

  test('overriding the ref converts to proxy? (yes)', async () => {
    const state = proxy({ nested: ref({ count: 0 }) });
    let listener = vi.fn();
    let unsub = subscribe(state, listener);
    ++state.nested.count;
    await Promise.resolve();
    expect(state.nested.count).toBe(1);
    expect(listener).toHaveBeenCalledTimes(0);
    unsub();

    // accidental assignement without ref
    state.nested = { count: 0 } as any;

    listener = vi.fn();
    unsub = subscribe(state, listener);
    ++state.nested.count;
    await Promise.resolve();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
