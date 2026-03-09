const delay = (ms: number) => {
  new Promise((resolve) => setTimeout(resolve, ms));
}

export const ready = (fn: () => void) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

export const randomDelay = (min = 100, max = 200) => {
  delay(min + Math.floor(Math.random() * (max - min)));
}
