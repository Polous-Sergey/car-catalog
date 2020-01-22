import { Transform } from 'class-transformer';
import { isArray, trim } from 'lodash';

export const Trim = () =>
  Transform((value: string | string[]) => {
    if (isArray(value)) {
      return value.map(v => trim(v).replace(/\s\s+/g, ' '));
    }
    return trim(value).replace(/\s\s+/g, ' ');
  });
