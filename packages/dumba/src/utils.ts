/*
Performs a deep comparison between two values to determine if they are equivalent.
@see https://www.30secondsofcode.org/js/s/equals
*/
export function equals(a: any, b: any): boolean {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b
  if (a.prototype !== b.prototype) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false

  return keys.every((k) => equals(a[k], b[k]))
}
