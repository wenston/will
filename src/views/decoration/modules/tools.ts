export function createUid(): string {
  return new Date().getTime() + '-' + Math.random().toString(36).slice(2)
}
