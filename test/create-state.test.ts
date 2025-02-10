import { autorun, observable } from 'mobx';
import { proxy } from 'valtio/vanilla';
import { watch } from 'valtio/vanilla/utils';
import { describe, it, expect, beforeEach, assert } from 'vitest';

describe('mobx', () => {
  describe('observable', () => {
    it('should create observable', () => {
      let count = 0;
      let state = observable({ size: 4 });
      autorun(() => {
        state.size;
        ++count;
      });
      expect(count).toBe(1)
      state.size += 1;
      expect(count).toBe(2)
    });
  });
});

describe("valtio", () => {
  describe("proxy", () => {
    it("should create observable", () => {
      let count = 0;
      let state = proxy({ size: 4 });
      watch(get => {
        get(state);
        ++count;
      }, { sync: true })

      expect(count).toBe(1);
      state.size += 1;
      expect(count).toBe(2);
    })
  })
})
