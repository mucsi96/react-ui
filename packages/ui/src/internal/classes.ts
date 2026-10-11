export function classes(...values: (string | false | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}
