// @flow

// Use of Lifecycle identifier is encouraged in the methods of the objects that
// are recycled as it allows catching errors when interactio with an object from
// previous lifecycle is attempted.
export opaque type Lifecycle = number

// To define a class used in the pool you must implement `Recycle` interface
// meaning define recycle method.
export interface Recycle {
  constructor(): mixed;
  recycle(Lifecycle): mixed;
}

class Pool<a: Recycle> {
  static Lifecycle: Lifecycle
  static Recycle: Recycle
  lifecycle: Lifecycle = 1
  pool: a[] = []
  instanceConstructor: Class<a>

  constructor(constructor: Class<a>) {
    this.instanceConstructor = constructor
  }
  new(): a {
    const instance =
      this.pool.length > 0 ? this.pool.shift() : new this.instanceConstructor()
    instance.recycle(this.lifecycle++)
    return instance
  }
  delete(instance: a): void {
    this.pool.push(instance)
  }
}

const pool = <a: Recycle>(constructor: Class<a>): Pool<a> =>
  new Pool(constructor)

export default pool
