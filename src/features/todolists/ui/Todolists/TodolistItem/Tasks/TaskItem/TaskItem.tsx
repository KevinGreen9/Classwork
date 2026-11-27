import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type {ChangeEvent} from "react"
import {getListItemSx} from "./TaskItem.styles"
import {deleteTaskTC, updateTaskTC} from "../../../../../model/tasksSlice.ts";
import {useAppDispatch} from "../../../../../../../common/hooks";
import {EditableSpan} from "../../../../../../../common/components";
import {DomainTask} from "../../../../../api/tasksApi.types.ts";
import {TaskStatus} from "../../../../../../../common/enums";
import {DomainTodolist} from "../../../../../model/todolistsSlice.ts";

type Props = {
    task: DomainTask
    todolistId: string
    todolist: DomainTodolist
}

export const TaskItem = ({task, todolistId, todolist}: Props) => {
    const dispatch = useAppDispatch()

    const deleteTask = () => {
        dispatch(deleteTaskTC({todolistId, taskId: task.id}))
    }

    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
        dispatch(updateTaskTC({
            todolistId,
            taskId: task.id,
            domainModel: {status}
        }))
    }

    const changeTaskTitle = (title: string) => {
        dispatch(updateTaskTC({todolistId, taskId: task.id,  domainModel: {title} }))
    }

    const isTaskCompleted = task.status === TaskStatus.Completed

    return (
        <ListItem sx={getListItemSx(isTaskCompleted)}>
            <div>
                <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={todolist.entityStatus === 'loading'}/>
                <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={todolist.entityStatus === 'loading'} />
            </div>
            <IconButton onClick={deleteTask} disabled={todolist.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    )
}
