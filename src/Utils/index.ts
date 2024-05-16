import { PRIME_NUMBERS } from '../Constants';
import { IRelation } from '../Types/Game';

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateRelationsMap(): IRelation {
  let relations: IRelation = {};
  PRIME_NUMBERS.forEach(primeNumber => {
    PRIME_NUMBERS.forEach(secondPrimeNumber => {
      if (primeNumber != secondPrimeNumber)
        relations[primeNumber * secondPrimeNumber] = 50;
    });
  });
  return relations;
}
