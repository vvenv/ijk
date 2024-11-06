export const escape = (v: unknown) => {
  return `${v}`
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&#34;') // as it may be used in attributes
    .replace(/'/g, '&#39;'); // as it may be used in attributes
};
