import { describe, test, expect, beforeEach } from 'vitest';
import { action, makeObservable, observable, reaction } from 'mobx';
import { proxy, subscribe, ref } from 'valtio/vanilla';

describe('mobx', () => {
  const obj1 = Object.freeze({ obj1: true });
  const obj2 = Object.freeze({ obj2: true });
  // Distinction: #1
  // makeObservable can patch original object
  // so we don't have to use `this`.
  const createState = () => {
    const s = {
      obj: obj1 as object,
      setObj(value: object) {
        s.obj = value;
      },
    };
    return s;
  };

  let state = createState();
  let count = 0;

  beforeEach(() => {
    count = 0;
    state = createState();
    state = makeObservable(state, {
      obj: observable.ref,
      setObj: action,
    });
    const dispose = reaction(
      () => state.obj,
      (obj) => {
        console.log(`state.obj is changed!`);
        count++;
      }
    );

    return dispose;
  });

  test('expect no prior changes', () => {
    expect(count).toBe(0);
  });

  test("same ref don't trigger reaction", () => {
    state.setObj(obj1);
    state.setObj(obj1);
    state.setObj(obj1);
    state.setObj(obj1);
    expect(count).toBe(0);
  });

  test('new ref triggers reaction', () => {
    state.setObj(obj2);
    expect(count).toBe(1);
  });
});

describe('valtio', () => {
  const obj1: object = Object.freeze({ obj1: true });
  const obj2: object = Object.freeze({ obj2: true });
  const createState = () => {
    const s = {
      obj: ref(obj1),
      setObj(value: object) {
        this.obj = ref(value);
      },
    };
    return s;
  };

  let state = createState();
  let count = 0;

  beforeEach(() => {
    count = 0;
    state = proxy(createState());
    const unsubscribe = subscribe(state, () => {
      console.log(`state.obj is changed!`);
      count++;
    });

    return unsubscribe;
  });

  test('expect init subscribe', () => {
    expect(count).toBe(0);
  });

  // Distinction: #2
  // Because mobx and valtio trigger subscribers differently,
  // we have to use async functions to run assertion in next tick.
  test("same ref don't trigger autorun", async () => {
    state.setObj(obj1);
    state.setObj(obj1);
    state.setObj(obj1);
    state.setObj(obj1);
    await Promise.resolve();
    expect(count).toBe(0);
  });

  test('new ref triggers subscribe', async () => {
    state.setObj(obj2);
    await Promise.resolve();
    expect(count).toBe(1);

    state.setObj(obj2);
    await Promise.resolve();
    expect(count).toBe(1);

    state.setObj({});
    await Promise.resolve();
    expect(count).toBe(2);
  });
});
