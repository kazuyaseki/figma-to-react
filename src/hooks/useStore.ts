import create from 'zustand'
import * as _ from 'lodash'

export const useStore = create((set: any, get: any) => ({
  addDesignToken: (tokenName: string, tokenValue: any) =>
    set((state: any) => ({
      designTokens: [...state.designTokens, { id: state.designTokensCounter, tokenName, tokenValue }],
      designTokensCounter: state.designTokensCounter + 1
    })),
  getDesignTokenByName: (tokenName: string) => {
    const designTokens = get().designTokens
    const designToken = designTokens.find((designToken: any) => designToken.tokenName === tokenName)
    return designToken
  },
  getDesignTokenByPropertyName: (propertyName: string) => {
    const designTokens = get().designTokens
    const properties = get().properties
    const property = properties.find((currentProperty: any) => propertyName === currentProperty.id)
    console.log('getDesignTokenByPropertyName property')
    console.log(property)
    if (property?.linkedToken) {
      const designToken = designTokens.find((designToken: any) => designToken.tokenName === property.linkedToken)
      return designToken
    }
    return undefined
  },
  getPropertyByName: (propertyName: string) => {
    const properties = get().properties
    const property = properties.find((property: any) => property.id === propertyName)
    return property
  },
  updateDesignToken: (id: number, tokenName?: string, tokenValue?: any) =>
    set((state: any) => {
      const designToken = state.designTokens.find((designToken: any) => designToken.id === id)
      const tokenNameChanged = !_.isEmpty(tokenName) && tokenName !== designToken.tokenName
      const tokenValueChanged = !_.isEmpty(tokenValue) && tokenValue !== designToken.tokenValue
      if (tokenNameChanged) {
        const tokenNameAlreadyExists = state.designTokens.find((designToken: any) => designToken.tokenName === tokenName)
        if (!tokenNameAlreadyExists) {
          return {
            designTokens: state.designTokens.map((token: any) => (token === designToken ? { id, tokenName: tokenName, tokenValue: designToken.tokenValue } : token))
          }
        }
      } else if (tokenValueChanged) {
        return {
          designTokens: state.designTokens.map((token: any) => (token === designToken ? { id, tokenName: designToken.tokenName, tokenValue: tokenValue } : token))
        }
      }
    }),
  updateProperty: (nodeId: string, propertyName: string, propertyValue: any, linkedToken?: string) =>
    set((state: any) => {
      const property = state.properties.find((currentProperty: any) => nodeId === currentProperty.nodeId && propertyName === currentProperty.id)
      if (property) {
        let newProperties: any = { value: propertyValue }
        if (linkedToken !== undefined) {
          newProperties = { ...newProperties, linkedToken }
        }
        return {
          properties: state.properties.map((currentProperty: any) => (currentProperty === property ? { ...currentProperty, ...newProperties } : currentProperty))
        }
      } else {
        let newProperty: any = { nodeId: nodeId, id: propertyName, value: propertyValue }
        if (linkedToken) {
          newProperty = { ...newProperty, linkedToken }
        }
        return {
          properties: [...state.properties, newProperty]
        }
      }
    }),
  designTokensCounter: 0,
  designTokens: [],
  properties: []
}))
