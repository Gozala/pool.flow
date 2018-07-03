// @flow

// Use of Lifecycle identifier is encouraged in the methods of the objects that
// are recycled as it allows catching errors when interactio with an object from
// previous lifecycle is attempted.
export opaque type Lifecycle = number

export type Instance = {
  recycle(Lifecycle): mixed
}

export default class Pool<a: Instance> {
  lifecycle: Lifecycle = 1
  pool: a[] = []
  static pool<a: Instance>(constructor: Class<a>): Pool<a> {
    return new Pool()
  }
  static new<a: Instance>(pool: Pool<a>, constructor: Class<a>): a {
    return pool.new(constructor)
  }
  static delete<a: Instance>(pool: Pool<a>, instance: a): void {
    return pool.delete(constructor)
  }
  new(constructor: Class<a>): a {
    const instance =
      this.pool.length > 0 ? this.pool.shift() : new constructor()
    instance.recycle(this.lifecycle++)
    return instance
  }
  delete(instance: a): void {
    this.pool.push(instance)
  }
}
