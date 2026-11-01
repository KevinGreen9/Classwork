import React, {useCallback} from "react";
import {AddItemForm} from "./common/components/AddItemForm/AddItemForm.tsx";
import {EditTableSpan} from "./common/components/EditTableSpan/EditTableSpan.tsx";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task.tsx";
import {FilterValues} from "./features/model/todolists-reducer.ts";
import {TaskType} from "./features/model/tasks.reducer.ts";
import {TodolistType} from "./App/App.tsx";

export type PropsType = {
    id: TodolistType["id"]
    title: string
    tasks: TaskType[]
    addTask: (todolistId: string, title: string) => void
    changeTodolist: (todolistId: string, newTodolist: string) => void
    filter: FilterValues
    deleteTodolist: (todolistId: string) => void
    changeFilter: (todolistId: string, value: FilterValues) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    changeSpan: (todolistId: string, taskId: string, newTitle: string) => void
}

export const Todolist = React.memo(function (props: PropsType) {


    const addTask = useCallback((title: string) => {
        props.addTask(props.id, title)
    }, [props.id, props.title])

    const onChangeTodolistHandler = useCallback((newTodolist: string) => {
        props.changeTodolist(props.id, newTodolist)
    }, [props.id, props.title])

    const deleteTodolistHandler = useCallback(() => {
        props.deleteTodolist(props.id)
    }, [props.id])

    let tasksForTodolist = props.tasks;

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => !t.isDone);
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.isDone);
    }

    return (
        <div>
            <h3>
                <EditTableSpan title={props.title} onChange={onChangeTodolistHandler}/>
                <IconButton onClick={deleteTodolistHandler}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask}/>

            <ul>
                {
                    tasksForTodolist.map(t =>
                        <Task
                            key={t.id}
                            todolistId={props.id}
                            task={t}
                            changeSpan={props.changeSpan}
                            changeStatus={props.changeStatus}
                            removeTask={props.removeTask}

                        />
                    )
                }
            </ul>
            <div>
                <Button
                    color={'success'}
                    variant={props.filter === "all" ? "contained" : 'text'}
                    onClick={() => {
                        props.changeFilter(props.id, "all")
                    }}>
                    All
                </Button>
                <Button
                    color={'primary'}
                    variant={props.filter === "active" ? "contained" : 'text'}
                    onClick={() => {
                        props.changeFilter(props.id, "active")
                    }}>
                    Active
                </Button>
                <Button
                    color={'secondary'}
                    variant={props.filter === "completed" ? "contained" : 'text'}
                    onClick={() => {
                        props.changeFilter(props.id, "completed")
                    }}>
                    Completed
                </Button>
            </div>
        </div>
    )
})




