import Checkbox from "@mui/material/Checkbox"
import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import {Todolist} from "../features/todolists/api/todolistsApi.types.ts";
import {DomainTask, UpdateTaskModel} from "../features/todolists/api/tasksApi.types.ts";
import {todolistsApi} from "../features/todolists/api/todolistsApi.ts";
import {tasksApi} from "../features/todolists/api/tasksApi.ts";
import {AddItemForm, EditableSpan} from "../common/components";
import {TaskStatus} from "../common/enums";

export const AppHttpRequests = () => {
    const [todolists, setTodolists] = useState<Todolist[]>([])
    const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

    useEffect(() => {
        todolistsApi.getTodolists().then((todolists) => {
            setTodolists(todolists)
            todolists.forEach((todolist) => {
                tasksApi.getTasks(todolist.id).then((todolistTasks) => {
                    setTasks((tasks) => ({ ...tasks, [todolist.id]: todolistTasks }))
                })
            })
        })
    }, [])

    const createTodolist = (title: string) => {
        todolistsApi.createTodolist(title).then((newTodolist) => {
            setTodolists([newTodolist, ...todolists])
            setTasks({ ...tasks, [newTodolist.id]: [] })
        })
    }

    const deleteTodolist = (id: string) => {
        todolistsApi.deleteTodolist(id).then(() => {
            setTodolists(todolists.filter((todolist) => todolist.id !== id))
            delete tasks[id]
            setTasks({ ...tasks })
        })
    }

    const changeTodolistTitle = (id: string, title: string) => {
        todolistsApi.changeTodolist({ id, title }).then((updatedTodolist) => {
            setTodolists(todolists.map((todolist) => (todolist.id === id ? updatedTodolist : todolist)))
        })
    }

    const createTask = (todolistId: string, title: string) => {
        tasksApi.createTask({ todolistId, title }).then((newTask) => {
            setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
        })
    }

    const deleteTask = (todolistId: string, taskId: string) => {
        tasksApi.deleteTask({ todolistId, taskId }).then(() => {
            setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter((task) => task.id !== taskId) })
        })
    }

    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
        const todolistId = task.todolistId

        const model: UpdateTaskModel = {
            status: e.target.checked ? TaskStatus.Completed : TaskStatus.New,
        }
        tasksApi.updateTask({ todolistId, taskId: task.id, model }).then((updatedTask) => {
            setTasks({ ...tasks, [todolistId]: tasks[todolistId].map((el) => (el.id === task.id ? updatedTask : el)) })
        })
    }

    const changeTaskTitle = (task: DomainTask, title: string) => {
        const todolistId = task.todolistId

        const model: UpdateTaskModel = {
            title,
        }
        tasksApi.updateTask({ todolistId, taskId: task.id, model }).then((updatedTask) => {
            setTasks({ ...tasks, [todolistId]: tasks[todolistId].map((t) => (t.id === task.id ? updatedTask : t)) })
        })
    }

    return (
        <div style={{ margin: "20px" }}>
            <AddItemForm addItem={createTodolist} />
            {todolists.map((todolist) => (
                <div key={todolist.id} style={container}>
                    <div>
                        <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
                        <button onClick={() => deleteTodolist(todolist.id)}>x</button>
                    </div>
                    <AddItemForm addItem={(title) => createTask(todolist.id, title)} />
                    {tasks[todolist.id]?.map((task) => (
                        <div key={task.id}>
                            <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)}/>
                            <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
                            <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

const container: CSSProperties = {
    border: "1px solid black",
    margin: "20px 0",
    padding: "10px",
    width: "330px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
}
