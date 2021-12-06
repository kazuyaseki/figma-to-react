import create from 'zustand'
import * as _ from 'lodash'

export const useStore = create((set) => ({
  addDesignToken: (tokenName: string, tokenValue: any) =>
    set((state: any) => ({
      designTokens: [...state.designTokens, { id: state.designTokensCounter, tokenName, tokenValue }],
      designTokensCounter: state.designTokensCounter + 1
    })),
  addProperty: (propertyName: string, propertyValue: any) =>
    set((state: any) => ({
      properties: [...state.properties, { id: state.propertiesCounter, propertyName, propertyValue }],
      propertiesCounter: state.propertiesCounter + 1
    })),
  updateDesignToken: (id: number, tokenName?: string, tokenValue?: any) =>
    set((state: any) => {
      const designToken = state.designTokens.find((designToken: any) => designToken.id === id)
      const tokenNameChanged = !_.isEmpty(tokenName) && tokenName !== designToken.tokenName
      const tokenValueChanged = !_.isEmpty(tokenValue) && tokenValue !== designToken.tokenValue
      if (tokenNameChanged || tokenValueChanged) {
        const updatedTokenName = tokenNameChanged ? tokenName : designToken.tokenName
        const updatedTokenValue = tokenValueChanged ? tokenValue : designToken.tokenValue
        return {
          designTokens: state.designTokens.map((token: any) => (token === designToken ? { id, tokenName: updatedTokenName, tokenValue: updatedTokenValue } : token))
        }
      }
    }),
  designTokensCounter: 0,
  designTokens: [],
  propertiesCounter: 0,
  properties: []
}))
