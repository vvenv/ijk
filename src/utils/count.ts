export const count = (collection: any) => {
  if (collection?.length !== undefined) {
    return collection.length as number;
  }

  if (typeof collection === 'object' && collection !== null) {
    return Object.keys(collection).length;
  }

  if (typeof collection === 'number') {
    return collection;
  }

  return 0;
};
