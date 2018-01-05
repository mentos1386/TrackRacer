let camera = '';

const fields = [
  'speed',
  'camera',
];

export function tic(time: number) {
  fields.forEach((field) => {
    document.getElementById(field).innerText = '';
  });
}
