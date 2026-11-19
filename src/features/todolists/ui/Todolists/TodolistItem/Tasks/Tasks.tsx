import {TaskItem} from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import {useAppDispatch, useAppSelector} from "../../../../../../common/hooks";
import {fetchTasksTC, selectTasks} from "../../../../model/tasksSlice.ts";
import {DomainTodolist} from "../../../../model/todolistsSlice.ts";
import {useEffect} from "react";
import {DomainTask} from "../../../../api/tasksApi.types.ts";
import {TaskStatus} from "../../../../../../common/enums";

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
    const { id, filter } = todolist

    const tasks = useAppSelector(selectTasks)
    const dispatch = useAppDispatch()

    const todolistTasks = tasks[id]
    let filteredTasks = todolistTasks
    if (filter === "active") {
        filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
    }
    if (filter === "completed") {
        filteredTasks = todolistTasks.filter((task) =>  task.status === TaskStatus.Completed)
    }

    useEffect(() => {
        dispatch(fetchTasksTC(id))
    }, []);

    return (
        <>
            {filteredTasks?.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <List>
                    {filteredTasks?.map((task: DomainTask) => (
                        <TaskItem key={task.id} task={task} todolistId={id} />
                    ))}
                </List>
            )}
        </>
    )
}
