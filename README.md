[![test](https://github.com/kazuyaseki/figma-to-react/actions/workflows/ci.yml/badge.svg)](https://github.com/kazuyaseki/figma-to-react/actions/workflows/ci.yml)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/kazuyaseki/figma-to-react/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/kazuyaseki/figma-to-react/pulls)
[![Tweeting](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Figma%20to%20React%20is%20awesome%20https://github.com/kazuyaseki/figma-to-react/)

<p align="center"><img src="publish/icon.png" align="center" alt="Figma to React logo" width="128" height="128"></p>
  
<h1 align="center">Figma to React Component</h1>

<div align="center">
<a href="https://www.figma.com/community/plugin/959795830541939498/Figma-to-React-Component" align="center"><img src="publish/install_button.png" align="center" alt="Install Plugin"></a>
</div>

<br />

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

## Futrther features

### Change CSS format and size

You may choose either Pure CSS or styled-components, and you may also change size for px and rem.

<img src="publish/format_setting.png" align="center" alt="change format" />

### Component setting

You may add component setting.
When you add component setting including component name, name of children node(optional), and props(optional), the plugin will render matched node as component.

<img src="publish/component_setting_1.png" align="center" alt="adding Banner component setting" />

<img src="publish/component_setting_2.png" align="center" alt="Plugin generates Banner as component" />

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
