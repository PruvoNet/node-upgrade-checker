export const asyncFilter = async <T>(
  array: T[],
  callback: (value: T, index?: number) => Promise<boolean>
): Promise<T[]> => {
  const promises = array.map(async (value, index) => {
    return await callback(value, index);
  });
  const results: boolean[] = await Promise.all(promises);
  return array.filter((_, i) => results[i]);
};
