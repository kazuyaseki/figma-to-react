# Figma to React Component

<img src="publish/icon.png" align="center" alt="Figma to React logo" width="160" height="160">

## Development

```sh
npm install
npm run dev
```

## For Those of you Who would like to create your own Figma to xxx

Feel free to folk this repositoty, create and publish your own Figma to Vue, Flutter, SwiftUI or whatsoever!

`buildTagTree` method would be useful for such case.
`buildTagTree` method outputs a `tag` object in the following format which is independent from how the final outcome is structured.

```ts
export type Tag = {
  name: string
  isText: boolean
  textCharacters: string | null
  isImg: boolean
  properties: Property[]
  css: CSSData
  children: Tag[]
}
```
