export function getConvertedValue(value: string) {
  if (isNaN(+value)) {
    return value
  }
  return Number(value)
}
