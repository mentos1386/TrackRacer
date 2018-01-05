let lastTick = 0;
let fpsArray: number[] = [];

export function debugTick(time: number) {
  // FPS
  const timeInSec = time * 0.001;
  const delta = timeInSec - lastTick;
  const fps = Math.floor(1 / delta);

  if (fpsArray.length === 10) {
    fpsArray = fpsArray.reverse();
    fpsArray.pop();
    fpsArray = fpsArray.reverse();
  }
  fpsArray.push(fps);

  document.getElementById('fps').innerText = fps.toString();
  lastTick = timeInSec;

}
