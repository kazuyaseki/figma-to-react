import create from 'zustand'
import * as _ from 'lodash'

export const useStore = create((set: any, get: any) => ({
  designTokensCounter: 0,
  designTokensGroupsCounter: 0,
  designTokens: [],
  designTokensGroups: [],
  properties: [],

  addDesignToken: (tokenName: string, tokenValue: any) =>
    set((state: any) => ({
      designTokens: [...state.designTokens, { id: state.designTokensCounter, tokenName, tokenValue, tokenGroup: undefined }],
      designTokensCounter: state.designTokensCounter + 1
    })),
  addDesignTokenGroup: (groupName: string) =>
    set((state: any) => ({
      designTokensGroups: [...state.designTokensGroups, { id: state.designTokensGroupsCounter, groupName }],
      designTokensGroupsCounter: state.designTokensGroupsCounter + 1
    })),
  getDesignTokenById: (tokenId: string) => {
    const designTokens = get().designTokens
    const designToken = designTokens.find((designToken: any) => designToken.id === tokenId)
    return designToken
  },
  getDesignTokenByName: (tokenName: string) => {
    const designTokens = get().designTokens
    const designToken = designTokens.find((designToken: any) => designToken.tokenName === tokenName)
    return designToken
  },
  getLinkedToken: (nodeId: string, propertyName: string) => {
    const designTokens = get().designTokens
    const properties = get().getPropertiesByNodeId(nodeId)
    const property = properties.find((currentProperty: any) => propertyName === currentProperty.id)
    if (property?.linkedToken) {
      const designToken = designTokens.find((designToken: any) => designToken.tokenName === property.linkedToken)
      return designToken
    }
    return undefined
  },
  getPropertyByName: (nodeId: string, propertyName: string) => {
    const properties = get().getPropertiesByNodeId(nodeId)
    const property = properties.find((currentProperty: any) => propertyName === currentProperty.id)
    return property
  },
  getPropertiesByNodeId: (nodeId: string) => {
    const properties = get().properties
    const propertiesByNodeId = properties.filter((property: any) => property.nodeId === nodeId)
    return propertiesByNodeId
  },
  deleteToken: (id: number) =>
    set((state: any) => {
      const designToken = state.designTokens.find((designToken: any) => designToken.id === id)
      const index = state.designTokens.indexOf(designToken)
      return {
        designTokens: [...state.designTokens.slice(0, index), ...state.designTokens.slice(index + 1)]
      }
    }),
  deleteTokenGroup: (id: number) =>
    set((state: any) => {
      const designTokenGroup = state.designTokensGroups.find((designTokenGroup: any) => designTokenGroup.id === id)
      const index = state.designTokensGroups.indexOf(designTokenGroup)
      return {
        designTokensGroups: [...state.designTokensGroups.slice(0, index), ...state.designTokensGroups.slice(index + 1)]
      }
    }),
  setDesignTokens: (designTokens: any, designTokensCounter: number) =>
    set((state: any) => ({
      designTokens,
      designTokensCounter
    })),
  updateDesignToken: (id: number, tokenName?: string, tokenValue?: any, tokenGroup?: any) =>
    set((state: any) => {
      const designToken = state.designTokens.find((designToken: any) => designToken.id === id)
      const tokenNameChanged = !_.isEmpty(tokenName) && tokenName !== designToken.tokenName
      const tokenValueChanged = !_.isEmpty(tokenValue) && tokenValue !== designToken.tokenValue
      const tokenGroupChanged = tokenGroup !== undefined && tokenGroup !== designToken.tokenGroup
      if (tokenNameChanged) {
        const tokenNameAlreadyExists = state.designTokens.find((designToken: any) => designToken.tokenName === tokenName)
        if (!tokenNameAlreadyExists) {
          return {
            designTokens: state.designTokens.map((token: any) => (token === designToken ? { ...token, tokenName } : token))
          }
        }
      } else if (tokenValueChanged) {
        return {
          designTokens: state.designTokens.map((token: any) => (token === designToken ? { ...token, tokenValue } : token))
        }
      } else if (tokenGroupChanged) {
        return {
          designTokens: state.designTokens.map((token: any) => (token === designToken ? { ...token, tokenGroup } : token))
        }
      }
    }),
  updateDesignTokenGroup: (id: number, groupName?: string) =>
    set((state: any) => {
      const designTokenGroup = state.designTokensGroups.find((designTokenGroup: any) => designTokenGroup.id === id)
      const groupNameChanged = !_.isEmpty(groupName) && groupName !== designTokenGroup.groupName
      if (groupNameChanged) {
        const groupNameAlreadyExists = state.designTokensGroups.find((designTokenGroup: any) => designTokenGroup.groupName === groupName)
        if (!groupNameAlreadyExists) {
          return {
            designTokensGroups: state.designTokensGroups.map((group: any) => (group === designTokenGroup ? { id, groupName } : group))
          }
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
    })
}))
