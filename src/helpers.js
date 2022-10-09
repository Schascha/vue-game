export function getProperty(el, value) {
  return (
    el && parseInt(window?.getComputedStyle(el)?.getPropertyValue(value), 10)
  );
}

export function getTimeStamp() {
  return new Date().getTime();
}

export function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}
