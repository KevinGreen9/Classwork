import {createAppSlice} from "../../../common/utils";
import {tasksApi} from "../api/tasksApi.ts";
import {DomainTask, UpdateTaskModel} from "../api/tasksApi.types.ts";
import {setAppStatusAC} from "../../../App/appSlice.ts";
import {handleServerError} from "../../../common/utils/handleServerError.ts";


export const tasksSlice = createAppSlice({
    name: 'tasks',
    initialState: {} as TasksState,
    selectors: {
        selectTasks: (state) => state
    },
    reducers: (create) => ({
        fetchTasksTC: create.asyncThunk(
            async (todolistId: string, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const tasks = await tasksApi.getTasks(todolistId)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {todolistId, tasks}
                } catch (error) {
                    handleServerError(error, dispatch)
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
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const task = await tasksApi.createTask(payload)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {task}
                } catch (error) {
                    handleServerError(error, dispatch)
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
                    dispatch(setAppStatusAC({status: 'loading'}))
                     await tasksApi.deleteTask(payload)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return payload
                } catch (error) {
                    handleServerError(error, dispatch)
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

        updateTaskTC: create.asyncThunk(
            async (payload: {todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel>  }, {dispatch, rejectWithValue}) => {
                const { todolistId, taskId, domainModel }= payload
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const task = await tasksApi.updateTask({todolistId, taskId, model: domainModel})
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {task}
                } catch (error) {
                    handleServerError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const task = state[action.payload.task.todolistId].find((task) => task.id === action.payload.task.id)
                    if (task) {
                        task.status = action.payload.task.status
                        task.title = action.payload.task.title
                    }
                }
            }
        ),

    }),

})

export const { fetchTasksTC,
    deleteTaskTC,
    createTaskTC,
    updateTaskTC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>














