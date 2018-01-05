let camera = '';

const fields = [
  'speed',
  'camera',
];

export function
public setTextForElement(elementId: string, text: string) {
  document.getElementById(elementId).innerText = text.toString();
}