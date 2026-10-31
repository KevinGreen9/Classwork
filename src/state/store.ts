import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer.ts";
import {tasksReducer} from "./tasks.reducer.ts";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer);

// @ts-ignore
window.store = store;