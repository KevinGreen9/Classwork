import {todolistsReducer, todolistsSlice} from "../features/todolists/model/todolistsSlice.ts";
import {tasksReducer, tasksSlice} from "../features/todolists/model/tasksSlice.ts";
import {configureStore} from "@reduxjs/toolkit";
import {appReducer, appSlice} from "./appSlice.ts";

export const store = configureStore({
  reducer:  {
      [tasksSlice.name]: tasksReducer,
      [todolistsSlice.name]: todolistsReducer,
      [appSlice.name]: appReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
