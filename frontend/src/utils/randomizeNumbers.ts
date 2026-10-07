export function randomizeNumbers(maxLength: number): number[] {
  const length = Math.max(1, Math.floor(maxLength));

  return Array.from({ length }, () => Math.floor(Math.random() * 100));
}
