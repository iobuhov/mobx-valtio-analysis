import {
  action,
  autorun,
  makeObservable,
  observable,
  isObservable,
} from 'mobx';
import { describe, test, expect, vi, assert } from 'vitest';

class PropsGate<T> {
  props: T;
  constructor(props: T) {
    this.props = props;
    makeObservable(this, {
      props: observable.struct,
      setProps: action,
    });
  }

  setProps(props: T): void {
    this.props = props;
  }
}

describe('observable.struct', () => {
  test('should ignore new object if equal', () => {
    const gate = new PropsGate({ count: 0 });
    const mockEffect = vi.fn(() => gate.props);

    assert.isFalse(isObservable(gate.props));

    autorun(mockEffect);
    expect(mockEffect).toHaveBeenCalledTimes(1);
    gate.setProps({ count: 1 });
    expect(mockEffect).toHaveBeenCalledTimes(2);
    gate.setProps({ count: 2 });
    expect(mockEffect).toHaveBeenCalledTimes(3);
    gate.setProps({ count: 2 });
    expect(mockEffect).toHaveBeenCalledTimes(3);
  });

  test('should not trigger derived gate?', () => {
    const gate = new PropsGate({ count: 0, randomN: Math.random() });
    const derivedGate = observable({
      get count() {
        console.log('Changed');
        return gate.props.count;
      },
    });
    const mockEffect = vi.fn(() => derivedGate.count);

    autorun(mockEffect);
    expect(mockEffect).toHaveBeenCalledTimes(1);
    gate.setProps({ count: 0, randomN: Math.random() });
    gate.setProps({ count: 0, randomN: Math.random() });
    gate.setProps({ count: 0, randomN: Math.random() });
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });
});
