import { ValueTransformer } from 'typeorm';

export class PriceTransformer implements ValueTransformer {
  to(entityValue: number): number {
    return Math.round(entityValue * 100);
  }

  from(databaseValue: number): number {
    return databaseValue / 100;
  }
}
