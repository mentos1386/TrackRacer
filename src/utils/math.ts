export function degToRad(degrees: number) {
  return degrees * Math.PI / 180;
}

export function normalizeArray(array: number[], maxNew = 1, minNew = -1) {
  const max = Math.max(...array);
  const min = Math.min(...array);
  const c = (maxNew - minNew) / (max - min);

  return array.map((i) => {
    return c * ((i - max) + max);
  });
}


export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
