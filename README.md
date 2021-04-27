<p align="center"><img src="publish/icon.png" align="center" alt="Figma to React logo" width="128" height="128"></p>

[![test](https://github.com/kazuyaseki/figma-to-react/actions/workflows/ci.yml/badge.svg)](https://github.com/kazuyaseki/figma-to-react/actions/workflows/ci.yml)

<h1 align="center">Figma to React Component</h1>

https://user-images.githubusercontent.com/6080698/116072313-de1cd180-a6c9-11eb-8e32-fe9a2f9a79f8.mov

## The Problem

Many Figma to Code tools have one or more problems of the follwings:

- generates for whole Figma file(not by component)
- need to go outside of Figma to visit service's site
- layout style is not responsive, and is absolute positioned to its parent

## Solution

Figma to React Component outputs React code in the plugin UI and can be genrated by selecting certain node.
And its style is derived from Auto Layout properties, thus is responsive.

<img src="publish/readme_demo.png" align="center" alt="How the plugin works" />

## Development

```sh
npm install
npm run dev
```

## For Those of you Who would like to create your own Figma to xxx

Feel free to folk this repositoty, create and publish your own Figma to Vue, Flutter, SwiftUI or whatsoever!

`buildTagTree` method would be useful for such case.
`buildTagTree` metssod outputs a `tag` object in the following format which is independent from how the final outcome is structured.

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
