/** Test to show the difference on how to create observable map */

import { describe, test, assert } from 'vitest';
import {
  makeObservable,
  makeAutoObservable,
  isObservable,
  observable,
} from 'mobx';

describe('mobx', () => {
  test('makeAutoObservable convert maps automatically', () => {
    const state = makeAutoObservable({ map: new Map() });
    assert(isObservable(state.map), 'map should be converted');
  });

  test('makeObservable convert map when annotated', () => {
    const state = makeObservable({ map: new Map() }, { map: observable });
    assert(isObservable(state.map), 'map should be converted');
  });

  test("makeObservable don't convert when observable.ref is used", () => {
    const map = new Map();
    const state = makeObservable({ map }, { map: observable.ref });
    assert(isObservable(state.map) === false);
    assert(Object.is(map, state.map), 'map is same object');
  });
});
