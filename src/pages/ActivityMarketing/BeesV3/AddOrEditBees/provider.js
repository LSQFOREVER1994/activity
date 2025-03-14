import { createContext } from 'react'

export const DomDataContext = createContext( [] )
export const CurrentPages = createContext( [] )
export const CommonOperationFun = createContext( {} )
export const ComponentsDataContext = createContext( {} )
export default { DomDataContext, CurrentPages, CommonOperationFun }