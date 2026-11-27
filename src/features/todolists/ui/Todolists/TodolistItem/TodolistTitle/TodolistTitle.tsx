import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {useAppDispatch} from "../../../../../../common/hooks";
import {EditableSpan} from "../../../../../../common/components";
import {changeTodolistTitleTC, deleteTodolistTC, DomainTodolist} from "../../../../model/todolistsSlice.ts";

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
    const { id, title, entityStatus } = todolist

    const dispatch = useAppDispatch()

    const deleteTodolist = () => {

        dispatch(deleteTodolistTC(id))
    }

    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleTC({ id, title }))
    }

    return (
        <div className={styles.container}>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitle} disabled={todolist.entityStatus === 'loading'} />
            </h3>
            <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
