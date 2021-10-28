export const paramsToObject = (
  search: URLSearchParams
): { [key: string]: string } =>
  Array.from(search.keys()).reduce((acc, key) => {
    return {
      ...acc,
      [key]: search.get(key),
    };
  }, {});
