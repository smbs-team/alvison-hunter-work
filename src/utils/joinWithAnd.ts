export function joinWithAnd(input: any[]) {
  const last = input.pop();
  const result = input.length ? input.join(', ') + ' and ' + last : last;
  return result;
}
