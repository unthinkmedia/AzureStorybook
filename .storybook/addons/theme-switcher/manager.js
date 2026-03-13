export const managerEntries = (entries = []) => [
  ...entries,
  new URL('./manager.tsx', import.meta.url).pathname,
];
