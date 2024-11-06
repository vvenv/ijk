import { isInclude } from './is-include';

export const isIn = (value: any, collection: any) =>
  isInclude(collection, value);
