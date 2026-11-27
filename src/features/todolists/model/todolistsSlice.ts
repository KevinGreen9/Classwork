import {todolistsApi} from "../api/todolistsApi.ts";
import {Todolist} from "../api/todolistsApi.types.ts";
import {createAppSlice} from "../../../common/utils";
import {RequestStatus} from "../../../common/types";
import { setAppStatusAC} from "../../../App/appSlice.ts";
import {handleServerError} from "../../../common/utils/handleServerError.ts";


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
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const todolists = await todolistsApi.getTodolists()
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {todolists}
                } catch (error) {
                    handleServerError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    action.payload.todolists.forEach((tl) => state.push({...tl, filter: 'all', entityStatus: 'idle'}))
                }
            }
        ),
        changeTodolistTitleTC: create.asyncThunk(
            async ( payload: { id: string, title: string }, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const todolist = await todolistsApi.changeTodolist(payload)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {todolist}
                } catch (error) {
                    handleServerError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const index = state.findIndex((todolist) => todolist.id === action.payload.todolist.id)
                    if (index !== -1) {
                        state[index].title = action.payload.todolist.title
                    }
                }
            }
        ),
        createTodolistTC: create.asyncThunk(
            async (title: string, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const todolist = await todolistsApi.createTodolist(title)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {todolist}
                } catch (error) {
                    handleServerError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
                }
            }
        ),
        deleteTodolistTC: create.asyncThunk(
            async (id: string, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    dispatch(changeTodolistStatusAC({id, entityStatus: 'loading'}))
                await todolistsApi.deleteTodolist(id)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {id}
                } catch (error) {
                    handleServerError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const index = state.findIndex((todolist) => todolist.id === action.payload.id)
                    if (index !== -1) {
                        state.splice(index, 1)
                    }
                }
            }
        ),
        changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
            const todolist = state.find((todolist) => todolist.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        }),
        changeTodolistStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
            const todolist = state.find((todolist) => todolist.id === action.payload.id)
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus
            }
        })
    }),
})

export const {changeTodolistFilterAC,
    changeTodolistStatusAC,
    fetchTodolistsTC,
    changeTodolistTitleTC,
    createTodolistTC,
    deleteTodolistTC} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
    filter: FilterValues
    entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
