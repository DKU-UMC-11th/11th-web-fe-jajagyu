// URL의 page 값을 양의 정수로 정리한다. 잘못된 값이면 undefined(= 1페이지)로 본다.
export function parsePageParam(value: unknown) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : undefined;
}
