import React, { createContext, Dispatch, useContext, useReducer } from 'react';

interface StateType {
    server: string
    channel: {id: string, name: string},
}

type Action = {type: 'CHANGE_CHANNEL', id: string, name: string } | 
{ type: 'CHANGE_SERVER', id: string}

export const initialState = {
    server: "",
    channel: {id: "", name: ""},
}

type ContextType = [{ server: string, channel: {id: string, name: string} }, Dispatch<Action>]

export function reducer(state: StateType, action: Action){
    switch(action.type) {
        case "CHANGE_CHANNEL": 
            return {
                ...state,
                channel: {id: action.id , name: action.name}
            }
        case "CHANGE_SERVER":
            return {
                ...state,
                server: action.id
            }
    }
}

const StateContext = createContext<ContextType>({} as ContextType);

interface Props {
    initialState: StateType,
    reducer: (a: StateType, b: Action) => StateType
    children: React.ReactNode
}

function StateProvider({ initialState, reducer, children}: Props) {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>{children}</StateContext.Provider>
  )
}

export default StateProvider

export const useStateValue = () => useContext(StateContext);