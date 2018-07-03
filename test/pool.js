// @flow

import * as lib from "../"
import Pool from "../"
import type { Lifecycle } from "../"
import test from "blue-tape"

test("test baisc", async test => {
  test.isEqual(typeof lib, "object")
  test.isEqual(typeof Pool, "function", "default export is a function")
})

test("test example", async test => {
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

  const p1 = Point.new(0, 0)
  test.deepEqual({ x: p1.x, y: p1.y }, { x: 0, y: 0 }, "x:0, y:0")
  const ref1 = p1.ref
  test.equal(typeof ref1, "number", `p1.ref //=> ${String(p1.ref)}`)

  p1.delete()

  const p2 = Point.new(10, 7)
  test.deepEqual({ x: p2.x, y: p2.y }, { x: 10, y: 7 }, "x:10, y:7")
  test.equal(p1 === p2, true, "p1 === p2")
  test.equal(typeof p2.ref, "number", `p2.ref //=> ${String(p2.ref)}`)
  test.equal(ref1 === p2.ref, false, "p2.ref != p1.ref")
  test.throws(
    () => p2.deref(ref1),
    /Object with this ref was recycled/,
    "deref throws"
  )

  const p3 = Point.new(3, 4)
  test.deepEqual({ x: p3.x, y: p3.y }, { x: 3, y: 4 }, "x:3, y:4")
  test.equal(p2 !== p3, true, "p2 !== p3")
  test.equal(typeof p3.ref, "number", `p3.ref //=> ${String(p3.ref)}`)
  test.equal(p2.ref != p3.ref, true, "p2.ref != p3.ref")
})
