export const shuffle = (a: Array<any>) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const sum = (array: Array<any>) => {
  let total = 0;
  array.forEach((a) => (total += a));
  return total;
};
