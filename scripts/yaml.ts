const PLAIN_SCALAR_UNSAFE = /(^$)|(^\s|\s$)|(:\s)|(\s#)|(^[-?:,[\]{}#&*!|>'"%@`])/;

export function toYamlInlineScalar(value: string): string {
  return PLAIN_SCALAR_UNSAFE.test(value) ? JSON.stringify(value) : value;
}
