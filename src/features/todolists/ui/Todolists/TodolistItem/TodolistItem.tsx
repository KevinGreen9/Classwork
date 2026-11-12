import {Tasks} from "./Tasks/Tasks"
import {TodolistTitle} from "./TodolistTitle/TodolistTitle"
import {FilterButtons} from "./FilterButton/FilterButton.tsx";
import {AddItemForm} from "../../../../../common/components";
import {useAppDispatch} from "../../../../../common/hooks";
import {DomainTodolist} from "../../../model/todolistsSlice.ts";
import {createTaskAC} from "../../../model/tasksSlice.ts";

type Props = {
    todolist: DomainTodolist
}

export const TodolistItem = ({todolist}: Props) => {
    const dispatch = useAppDispatch()

    const createTask = (title: string) => {
        dispatch(createTaskAC({todolistId: todolist.id, title}))
    }

    return (
        <div>
            <TodolistTitle todolist={todolist}/>
            <AddItemForm addItem={createTask}/>
            <Tasks todolist={todolist}/>
            <FilterButtons todolist={todolist}/>
        </div>
    )
}
