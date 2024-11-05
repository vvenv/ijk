import { Safe } from './safe';

export const abs = (value: number) => Math.abs(value);
export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
export const date = (value: string) => new Date(value).toISOString();
export const entries = (value: object) => Object.entries(value);
export const escape = (value: string) =>
  value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const even = (value: number | string) => +value % 2 === 0;
export const first = (value: string | any[]) => [...value][0];
export const join = (value: string[], separator = '') => value.join(separator);
export const json = (value: any) => JSON.stringify(value);
export const keys = (value: object) => Object.keys(value);
export const last = (value: string | any[]) => [...value].reverse()[0];
export const length = (value: string) => value.length;
export const lower = (value: string) => value.toLowerCase();
export const odd = (value: number | string) => +value % 2 === 1;
export const repeat = (value: string, count: number) => value.repeat(count);
export const replace = (value: string, search: string, replace: string) =>
  value.replace(new RegExp(search, 'g'), replace);
export const reverse = (value: string | any[]) =>
  Array.isArray(value) ? value.reverse() : [...value].reverse().join('');
export const safe = (value: string) => new Safe(value);
export const slice = (value: string, start: number, end?: number) =>
  value.slice(start, end);
export const sort = (value: string | any[]) =>
  Array.isArray(value) ? value.sort() : [...value].sort().join('');
export const split = (value: string, separator = '') => value.split(separator);
export const sum = (value: number[]) => value.reduce((a, b) => a + b, 0);
export const time = (value: string) => new Date(value).getTime();
export const trim = (value: string) => value.trim();
export const unique = (value: string | any[]) =>
  Array.isArray(value)
    ? Array.from(new Set(value))
    : Array.from(new Set(value)).join('');
export const upper = (value: string) => value.toUpperCase();
export const values = (value: object) => Object.values(value);
