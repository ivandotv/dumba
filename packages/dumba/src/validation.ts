import { Form } from './form'

export function createValidation(
  fn: (value: any, ctx: Form) => boolean | Promise<boolean>,
  msg: string
) {
  return new Validation(fn, msg)
}

export class Validation {
  constructor(
    public fn: (value: any, ctx: any) => boolean | Promise<boolean>,
    public msg: string
  ) {}
}
