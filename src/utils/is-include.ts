export const isInclude = (collection: any, value: any) => {
  if (collection?.includes) {
    return collection.includes(value) as boolean;
  }

  if (typeof collection === 'object' && collection !== null) {
    return Object.values(collection).includes(value);
  }

  return false;
};
