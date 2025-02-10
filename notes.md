## Notes

### Mobx

#### makeObservable

> This function can be used to make existing object properties observable. Any JavaScript object (including class instances) can be passed into target. Typically makeObservable is used in the constructor of a class, and its first argument is this. The annotations argument maps annotations to each member. **Only annotated members are affected.**

That means that `makeObservable` is mutating original object.

### About batching

Use `{ sync: true }` for all valtio exmples to be as close as possible to mobx API.