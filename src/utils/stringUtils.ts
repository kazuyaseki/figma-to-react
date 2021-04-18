export const kebabize = (str: string): string => {
  return str
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}` : letter
    })
    .join('')
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function kebabToUpperCamel(str: string): string {
  return capitalizeFirstLetter(str.split(/-|_/g).map(capitalizeFirstLetter).join(''))
}
