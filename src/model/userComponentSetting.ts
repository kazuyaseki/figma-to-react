export type UserComponentSetting = {
  name: string
  props: {
    type: 'TEXT'
    name: string
    labelNodeName: string
  }[]
  childrenNodeName: string | null
}
