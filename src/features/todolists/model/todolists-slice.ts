import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {todolistsApi} from "../api/todolistsApi.ts";
import {Todolist} from "../api/todolistsApi.types.ts";


export const todolistsSlice = createSlice({
    name: "todolists",
    initialState: [] as DomainTodolist[],
    selectors: {
        selectTodolists: (state) => state
    },
    reducers: (create) => ({
        changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
            const todolist = state.find((todolist) => todolist.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        })
    }),
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
                return action.payload.map((tl) => ({ ...tl, filter:  'all'}))
            })
            .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex((todolist) => todolist.id === action.payload.id)
                if (index !== -1) {
                    state[index].title = action.payload.title
                }
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                const index = state.findIndex((todolist) => todolist.id === action.payload.id)
                if (index !== -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(createTodolistTC.fulfilled, (state, action) => {
                const newTodolist: DomainTodolist = {
                    ...action.payload,
                    filter: "all"
                }
                state.push(newTodolist)
            })

    }
})

export const fetchTodolistsTC = createAsyncThunk (`${todolistsSlice.name}/fetchTodolistsTC`,
    async (_arg, { rejectWithValue}) => {
        try {
            const res = await todolistsApi.getTodolists()
            return res.data
        } catch (e) {
            return  rejectWithValue(e)
        }
    })

export const changeTodolistTitleTC = createAsyncThunk (`${todolistsSlice.name}/changeTodolistTitleTC`,
    async (arg: {id: string, title: string}, { rejectWithValue}) => {
        try {
            await todolistsApi.changeTodolist(arg)
            return arg
        } catch (e) {
            return  rejectWithValue(e)
        }
    })

export const createTodolistTC = createAsyncThunk (`${todolistsSlice.name}/createTodolistTC`,
    async  (title: string, { rejectWithValue}) => {
        try {
            const res =  await  todolistsApi.createTodolist(title)
            return res.data.data.item
        } catch (e) {
            return  rejectWithValue(e)
        }
    })

export const deleteTodolistTC = createAsyncThunk (`${todolistsSlice.name}/deleteTodolistTC`,
    async (arg: {id: string}, { rejectWithValue}) => {
        try {
            await todolistsApi.deleteTodolist(arg.id)
            return arg
        } catch (e) {
            return  rejectWithValue(e)
        }
    })


export const {
    changeTodolistFilterAC
} = todolistsSlice.actions

export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
