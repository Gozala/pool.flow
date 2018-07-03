// @flow

import Pool from "pool.flow"
import type { Lifecycle } from "pool.flow"

class Point {
  x: number
  y: number
  ref: Lifecycle
  static pool = new Pool()
  delete() {
    delete this.x
    delete this.y
    Point.pool.delete(this)
  }
  recycle(ref: Lifecycle) {
    this.ref = ref
  }
  deref(ref: Lifecycle): Point {
    if (this.ref === ref) {
      return this
    } else {
      throw Error(`Object with this ref was recycled`)
    }
  }
  static new(x: number, y: number): Point {
    const self = Point.pool.new(Point)
    self.x = x
    self.y = y
    return self
  }
}

const p1 = Point.new(0, 0) //?
const ref1 = p1.ref //?

p1.delete()

const p2 = Point.new(10, 7) //?
p1 === p2 //?
p2.deref(ref1) //?
