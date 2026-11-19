import {createAsyncThunk} from "@reduxjs/toolkit"
import {todolistsApi} from "../api/todolistsApi.ts";
import {Todolist} from "../api/todolistsApi.types.ts";
import {createAppSlice} from "../../../common/utils";
import {changeStatusAC} from "../../../App/appSlice.ts";


export const todolistsSlice = createAppSlice({
    name: "todolists",
    initialState: [] as DomainTodolist[],
    selectors: {
        selectTodolists: (state) => state
    },
    reducers: (create) => ({
        fetchTodolistsTC: create.asyncThunk(
            async (_, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                    const todolists = await todolistsApi.getTodolists()
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {todolists}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    action.payload.todolists.forEach((tl) => state.push({...tl, filter: 'all'}))
                }
            }
        ),
        changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
            const todolist = state.find((todolist) => todolist.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        })
    }),
    extraReducers: (builder) => {
        builder
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
                state.unshift({...action.payload.todolist, filter: "all"})
            })

    }
})

export const changeTodolistTitleTC = createAsyncThunk(`${todolistsSlice.name}/changeTodolistTitleTC`,
    async (arg: { id: string, title: string }, {rejectWithValue}) => {
        try {
            await todolistsApi.changeTodolist(arg)
            return arg
        } catch (e) {
            return rejectWithValue(null)
        }
    })

export const createTodolistTC = createAsyncThunk(`${todolistsSlice.name}/createTodolistTC`,
    async (title: string, {rejectWithValue}) => {
        try {
            const todolist = await todolistsApi.createTodolist(title)
            return {todolist}
        } catch (e) {
            return rejectWithValue(null)
        }
    })

export const deleteTodolistTC = createAsyncThunk(`${todolistsSlice.name}/deleteTodolistTC`,
    async (id: string, {rejectWithValue}) => {
        try {
            await todolistsApi.deleteTodolist(id)
            return {id}
        } catch (e) {
            return rejectWithValue(null)
        }
    })


export const {changeTodolistFilterAC, fetchTodolistsTC} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
