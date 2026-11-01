import {combineReducers} from "redux";
import {todolistsReducer} from "../features/model/todolists-reducer.ts";
import {tasksReducer} from "../features/model/tasks.reducer.ts";
import {configureStore} from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer:  rootReducer
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store;