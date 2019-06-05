export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const areObjEqual = (obj1: {}, obj2: {}): boolean => {
  const values1 = Object.entries(obj1).map(([key, value]) => value);
  const values2 = Object.entries(obj2).map(([key, value]) => value);
  let r = true;
  for (let i = 0; i < values1.length; i++) {
    if (values1[i] !== values2[i]) {
      r = false;
      break;
    }
  }

  return r;
};
