import {createTodolistTC, deleteTodolistTC} from "./todolistsSlice.ts";
import {createAppSlice} from "../../../common/utils";
import {tasksApi} from "../api/tasksApi.ts";
import {DomainTask, UpdateTaskModel} from "../api/tasksApi.types.ts";
import {TaskStatus} from "../../../common/enums";
import {changeStatusAC} from "../../../App/appSlice.ts";


export const tasksSlice = createAppSlice({
    name: 'tasks',
    initialState: {} as TasksState,
    selectors: {
        selectTasks: (state) => state
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTodolistTC.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
    },
    reducers: (create) => ({
        fetchTasksTC: create.asyncThunk(
            async (todolistId: string, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                    const tasks = await tasksApi.getTasks(todolistId)
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {todolistId, tasks}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                  state[action.payload.todolistId]= action.payload.tasks
                }
            }
        ),

        createTaskTC: create.asyncThunk(
            async (payload: {todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                    const task = await tasksApi.createTask(payload)
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {task}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state[action.payload.task.todolistId].unshift(action.payload.task)
                }
            }
        ),
        deleteTaskTC: create.asyncThunk(
            async (payload: {todolistId: string; taskId: string}, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                     await tasksApi.deleteTask(payload)
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return payload
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                    if (index !== -1) {
                        tasks.splice(index, 1)
                    }
                }
            }
        ),

        changeTaskStatusTC: create.asyncThunk(
            async (payload: {todolistId: string; taskId: string; status: TaskStatus }, {dispatch, rejectWithValue}) => {
                const { todolistId, taskId, status }= payload
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                    const task = await tasksApi.updateTask({todolistId, taskId, model: {status} })
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {task}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const task = state[action.payload.task.todolistId].find((task) => task.id === action.payload.task.id)
                    if (task) {
                        task.status = action.payload.task.status ? TaskStatus.Completed : TaskStatus.New
                    }
                }
            }
        ),
        changeTaskTitleTC: create.asyncThunk(
            async (payload: {todolistId: string; taskId: string; title: UpdateTaskModel}, {dispatch, rejectWithValue}) => {
                const { todolistId, taskId, title }= payload
                try {
                    dispatch(changeStatusAC({status: 'loading'}))
                    const task = await tasksApi.updateTask({todolistId, taskId, model:{title} })
                    dispatch(changeStatusAC({status: 'succeeded'}))
                    return {task}
                } catch (e) {
                    dispatch(changeStatusAC({status: 'failed'}))
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const task = state[action.payload.task.todolistId].find((task) => task.id === action.payload.task.id)
                    if (task) {
                        task.title = action.payload.task.title
                    }
                }
            }
        ),
        changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
            const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
            if (task) {
                task.title = action.payload.title
            }
        })
    }),

})

export const { fetchTasksTC, deleteTaskTC, createTaskTC, changeTaskStatusTC, changeTaskTitleTC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
