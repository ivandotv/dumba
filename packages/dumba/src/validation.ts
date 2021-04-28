import random from 'unique-random'

const unique = random(0, 10000)

export function createValidation(
  fn: (value: any, ctx: any) => boolean | Promise<boolean>,
  msg: string,
  name?: string
) {
  name = name ? name : `n${unique()}`

  return new Validation(fn, msg, name)
}

export class Validation {
  constructor(
    public fn: (value: any, ctx: any) => boolean | Promise<boolean>,
    public msg: string,
    public name: string
  ) {}
}
