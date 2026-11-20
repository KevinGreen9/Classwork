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
        changeTodolistTitleTC: create.asyncThunk(
            async ( payload: { id: string, title: string }, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                    const todolist = await todolistsApi.changeTodolist(payload)
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {todolist}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
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
                    dispatch(changeStatusAC({status: 'loading'}))
                    const todolist = await todolistsApi.createTodolist(title)
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {todolist}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.unshift({...action.payload.todolist, filter: "all"})
                }
            }
        ),
        deleteTodolistTC: create.asyncThunk(
            async (id: string, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                await todolistsApi.deleteTodolist(id)
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {id}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
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
        })
    }),
})

export const {changeTodolistFilterAC,
    fetchTodolistsTC,
    changeTodolistTitleTC,
    createTodolistTC,
    deleteTodolistTC} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
