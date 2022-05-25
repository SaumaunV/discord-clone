import React, { createContext, Dispatch, useContext, useReducer } from 'react';

interface StateType {
    channel: string,
}

interface Action {
    type: 'CHANGE_CHANNEL'; id: string,
}

export const initialState = {
    channel: "",
}

type ContextType = [{ channel: string }, Dispatch<Action>]

export function reducer(state: StateType, action: Action){
    switch(action.type) {
        case "CHANGE_CHANNEL": 
            return {
                ...state,
                channel: action.id
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