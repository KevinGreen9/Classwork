import {v1} from "uuid";

export type RemoveTodoActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodoActionType = {
    type: 'ADD-TODOLIST'
    todolist: {
        id: string,
        title: string,
        filter: FilterValues
    }
}
type ChangeTodoNameActionType = {
    type: 'CHANGE-TODOLIST'
    id: string
    title: string
}
type ChangeTodoFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValues
}

type ActionsTypes = RemoveTodoActionType | AddTodoActionType | ChangeTodoFilterActionType | ChangeTodoNameActionType


const initialState: TodolistType[] = []


export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionsTypes): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(t => t.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [...state, action.todolist]
        }
        case 'CHANGE-TODOLIST': {
            return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        }

        default:
            return state;
    }


}

export const RemoveTodoAC = (todolistId: string): RemoveTodoActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const AddTodoAC = ( title: string): AddTodoActionType => {
    return {type: 'ADD-TODOLIST',
        todolist: {
            id: v1(),
            title: title,
            filter: 'all'
        }}
}
export const ChangeNameTodoAC = (todolistId: string, title: string): ChangeTodoNameActionType => {
    return {type: 'CHANGE-TODOLIST', id: todolistId, title: title}
}
export const ChangeFilterTodoAC = (todolistId: string, filter: FilterValues): ChangeTodoFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: filter}
}

export type TodolistType = {
    id: string
    title: string
    filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
