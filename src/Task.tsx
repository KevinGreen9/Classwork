import type {TaskType} from "./Todolist.tsx";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";
import React, {type ChangeEvent, useCallback} from "react";
import {EditTableSpan} from "./common/components/EditTableSpan/EditTableSpan.tsx";

export type TaskProps = {
    changeStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    changeSpan: (todolistId: string, taskId: string, newTitle: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    task: TaskType
    todolistId: string
}

export const Task = React.memo(
(props: TaskProps) => {
    const onClickButtonHandler =useCallback (() => props.removeTask(props.todolistId, props.task.id), [props.todolistId, props.task.id, props.removeTask])
    const onChangeInputHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(props.todolistId,  props.task.id, e.currentTarget.checked)
    }, [props.todolistId, props.task.id, props.changeStatus])
    const onChangeSpanHandler = useCallback((newValue: string) => {
        props.changeSpan(props.todolistId,  props.task.id, newValue)
    }, [props.todolistId, props.task.id, props.changeSpan])

    return (
        <li key={props.task.id} className={ props.task.isDone ? 'is-done' : ''}>
            <Checkbox
                onChange={onChangeInputHandler}
                checked={ props.task.isDone}/>
            <EditTableSpan title={ props.task.title} onChange={onChangeSpanHandler}/>
            <IconButton onClick={onClickButtonHandler}>
                <Delete/>
            </IconButton>
        </li>
    )
})