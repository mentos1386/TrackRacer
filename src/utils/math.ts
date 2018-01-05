export function degToRad(degrees: number) {
  return degrees * Math.PI / 180;
}

export function normalizeArray(array: number[], maxNew = 1, minNew = 0) {
  const normalized: number[] = [];
  const max = Math.max(...array);
  const min = Math.min(...array);
  const c = (maxNew - minNew) / (max - min);

  array.forEach(i => normalized.push(c * (i - max) + max));
  return normalized;
}
