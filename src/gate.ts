import { action, computed, makeObservable, observable } from 'mobx';

interface PropsReadableGate<T> {
  props: T;
}

interface PropsWritableGate<T> {
  props: T;
  setProps(props: T): void;
}

export class ReadableGate<T> implements PropsReadableGate<T> {
  constructor(private proxy: PropsWritableGate<T>) {
    makeObservable(this, { props: computed });
  }
  get props(): T {
    return this.proxy.props;
  }
}

export class WritableGate<T> implements PropsWritableGate<T> {
  constructor(public props: T) {
    makeObservable(this, { props: observable.struct, setProps: action });
  }

  setProps(props: T): void {
    this.props = props;
  }
}
