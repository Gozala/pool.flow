# pool.flow

[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]

Generic object pool with type friendly API for usage with flow.

## Usage

### Import

Rest of the the document & provided code examples assumes that library is installed (with yarn or npm) and imported as follows:

```js
import Pool from "pool.flow"
import type { Lifecycle } from "pool.flow"
```

You can define your class and pool for it's instances as follows:

```js
class Point {
  x: number
  y: number
  // You'll need to create an object pool by calling `pool(Point)`. You can save
  // a pool anywhere, here we use static field of the class itself.
  static pool = new Pool()
  // Given that objects in the pool going to be recycled it is useful to use
  // something other than object identity for an instance identity. Library
  // provides opaque `Lifecycle` type for that purpose.
  ref: Lifecycle
  // Your class is required to implement `recycle` method which will be given
  // this `Lifecycle` value so you can store it somewhere.
  recycle(ref: Lifecycle) {
    this.ref = ref
  }
  // You are encouraged to use `Lifecycle` to validate that users aren't using
  // recycled instances by mistake. For example `defer` method here takes
  // `Lifecycle` to unsure user isn't interacting with old one by mistake.
  deref(ref: Lifecycle): Point {
    if (this.ref === ref) {
      return this
    } else {
      throw Error(`Object with this ref was recycled`)
    }
  }
  // Since you'll be recycling objects you can't really use `new Point(x, y)`
  // instead you can define static function to do the construction + initialization
  // that under the hood will use pool to allocate an instance.
  static new(x: number, y: number): Point {
    const self = Point.pool.new(Point)
    self.x = x
    self.y = y
    return self
  }
  // You will also need to return objects back to the pool for recycling by
  // calling `pool.delete(instance)` but in practice you'll need to remove all
  // the references to other objects so it's recomended to implement some method
  // like `delete` here that removes all referencees first and then returns
  // instance into the pool.
  delete() {
    delete this.x
    delete this.y
    Point.pool.delete(this)
  }
}

const p1 = Point.new(0, 0) //? {x:0, y:0, ref:1}
const ref1 = p1.ref
// Return object back to the pool
p1.delete()

const p2 = Point.new(10, 7) //? {x:10, y:7, ref:2}
// Notice that p1 and p2 ar the same instance here
p1 === p2 //? true

// But you won't be able to dereference it new one
// with a former ref.
p2.deref(ref1) //? Error: Object with this ref was recycled
```

You can build more ergonomic and safer API on top, this intentionally provides
bare bones as API choices would really depend on case by case basis.

## Install

    npm install pool.flow

[travis.icon]: https://travis-ci.org/Gozala/pool.flow.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/pool.flow
[version.icon]: https://img.shields.io/npm/v/pool.flow.svg
[downloads.icon]: https://img.shields.io/npm/dm/pool.flow.svg
[package.url]: https://npmjs.org/package/pool.flow
[downloads.image]: https://img.shields.io/npm/dm/pool.flow.svg
[downloads.url]: https://npmjs.org/package/pool.flow
[prettier.icon]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]: https://github.com/prettier/prettier
