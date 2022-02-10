import create from 'zustand'
import * as _ from 'lodash'
import { DesignTokenType } from '../model/DesignToken'
import { COLOR_STYLES_GROUP_NAME, EFFECT_STYLES_GROUP_NAME, GRID_STYLES_GROUP_NAME, isFigmaStyleGroup, TEXT_STYLES_GROUP_NAME } from '../model/FigmaStyleGroup'
import { isHex, isNotANumber } from '../utils/unitTypeUtils'

export const useStore = create((set: any, get: any) => ({
  designTokensCounter: 0,
  designTokensGroupsCounter: 0,
  designTokens: [],
  designTokensGroups: [],
  nodes: [],
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
  deleteToken: (id: any) =>
    set((state: any) => {
      const designToken = state.designTokens.find((designToken: any) => designToken.id === id)
      const index = state.designTokens.indexOf(designToken)
      return {
        designTokens: [...state.designTokens.slice(0, index), ...state.designTokens.slice(index + 1)]
      }
    }),
  deleteTokenGroup: (id: any) =>
    set((state: any) => {
      const designTokenGroup = state.designTokensGroups.find((designTokenGroup: any) => designTokenGroup.id === id)
      const index = state.designTokensGroups.indexOf(designTokenGroup)
      return {
        designTokensGroups: [...state.designTokensGroups.slice(0, index), ...state.designTokensGroups.slice(index + 1)]
      }
    }),
  getDesignTokensByGroup: (groupName: string) => {
    const designTokens = get().designTokens
    const designTokensByGroup = designTokens.filter((designToken: any) => designToken.tokenGroup === groupName)
    return designTokensByGroup
  },
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
  getDesignTokensByType: (type: DesignTokenType) => {
    const designTokens = get().designTokens
    if (type === DesignTokenType.Color) {
      const colorDesignTokens = designTokens.filter((designToken: any) => designToken.tokenGroup === COLOR_STYLES_GROUP_NAME || isHex(designToken.tokenValue))
      return colorDesignTokens
    }
    if (type === DesignTokenType.Number) {
      const numberDesignTokens = designTokens.filter((designToken: any) => !isFigmaStyleGroup(designToken.tokenGroup) && !isNotANumber(designToken.tokenValue))
      return numberDesignTokens
    }
    if (type === DesignTokenType.Text) {
      const textDesignTokens = designTokens.filter((designToken: any) => designToken.tokenGroup === TEXT_STYLES_GROUP_NAME)
      return textDesignTokens
    }
    return []
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
  getNodeById: (nodeId: string) => {
    const nodes = get().nodes
    const nodeById = nodes.find((node: any) => node.id === nodeId)
    return nodeById
  },
  getPropertyByName: (nodeId: string, propertyName: string) => {
    const properties = get().getPropertiesByNodeId(nodeId)
    const property = properties.find((currentProperty: any) => propertyName === currentProperty.id)
    return property
  },
  getPropertiesByLinkedToken: (linkedToken: string) => {
    const properties = get().properties
    const propertiesByLinkedToken = properties.filter((property: any) => property?.linkedToken === linkedToken)
    return propertiesByLinkedToken
  },
  getPropertiesByNodeId: (nodeId: string) => {
    const properties = get().properties
    const propertiesByNodeId = properties.filter((property: any) => property.nodeId === nodeId)
    return propertiesByNodeId
  },
  isFigmaStyle: (tokenName: string) => {
    const designToken = get().getDesignTokenByName(tokenName)
    if (designToken && !_.isEmpty(designToken.tokenGroup)) {
      return (
        designToken.tokenGroup === COLOR_STYLES_GROUP_NAME ||
        designToken.tokenGroup === EFFECT_STYLES_GROUP_NAME ||
        designToken.tokenGroup === GRID_STYLES_GROUP_NAME ||
        designToken.tokenGroup === TEXT_STYLES_GROUP_NAME
      )
    }
    return false
  },
  setDesignTokens: (designTokens: any, designTokensCounter: number) =>
    set((state: any) => ({
      designTokens,
      designTokensCounter
    })),
  setDesignTokensGroups: (designTokensGroups: any, designTokensGroupsCounter: number) =>
    set((state: any) => ({
      designTokensGroups,
      designTokensGroupsCounter
    })),
  setNodes: (nodes: any) =>
    set((state: any) => ({
      nodes
    })),
  setProperties: (properties: any) =>
    set((state: any) => ({
      properties: _.unionWith(properties, state.properties, (first: any, second: any) => first.nodeId === second.nodeId && first.id === second.id)
    })),
  updateDesignToken: (id: any, tokenName?: string, tokenValue?: any, tokenGroup?: any) =>
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
  updateDesignTokenGroup: (id: any, groupName?: string) =>
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
