import { dictionary } from "./dictionary";

export function buildObject(dictionary: Array<dictionary>) {
  const obj = { fens: {} };

  for (let i = 0; i < dictionary.length; i++) {
    const key = dictionary[i].key;
    const value = dictionary[i].value;
    obj.fens[key] = value;
  }

  return obj;
}
