import '../App/App.css';
import {AddItemForm} from "../common/components/AddItemForm/AddItemForm.tsx";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {Todolist} from '../Todolist.tsx';
import {DomainTask, UpdateTaskModel} from "../features/api/tasksApi.types.ts";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ChangeFilterTodoAC, TodolistType} from "../features/model/todolists-reducer.ts";
import {FilterValuesType} from "../App/App.tsx";
import {todolistsApi} from "../features/api/todolistsApi.ts";
import {tasksApi} from "../features/api/tasksApi.ts";
import {TaskStatus} from "../common/enums/enums.ts";


export const AppWithRedux = () => {
    const [todolists, setTodolists] = useState<TodolistType[]>([])
    const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

    const dispatch = useDispatch();

    useEffect(()=> {
        todolistsApi.getTodolists().then((res) => {
            const todolists = res.data
            setTodolists(todolists)
            todolists.forEach((todolist) =>
            tasksApi.addTask(todolist.id).then((res) => {
                setTasks({...tasks, [todolist.id]: res.data.items})
            }))
        })
    }, [])

    const  removeTask = ( todolistId: string, taskId: string) => {
        tasksApi.removeTask({todolistId, taskId}).then(() => {
           setTasks({ [todolistId]: [...tasks[todolistId].filter(task => task.id !== taskId)]})
       })
    }

    const addTask = (todolistId: string, title: string) => {
        tasksApi.addTask({todolistId, title}).then((res) => {
            const newTask = res.data.data.item
            setTasks({ [todolistId]: [newTask, ...tasks[todolistId]]})
        })
    }

    const changeStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
        const model: UpdateTaskModel = {
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
            startDate: task.startDate,
            status: e.target.checked ? TaskStatus.Completed : TaskStatus.New,
        }
        tasksApi.changeStatus({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
            setTasks({
                ...tasks,
                [task.todoListId]: tasks[task.todoListId].map((el) => el.id !== task.id ? res.data.data.item : el),
            })
        })
    }

    const changeSpan = (task: DomainTask,  title: string ) => {
        const taskTitle: UpdateTaskModel = {
            title: title,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
        }
       tasksApi.changeSpan({todolistId: task.todoListId, taskId: task.id, taskTitle}).then((res) => {
           setTasks({
               ...tasks,
               [task.todoListId]: tasks[task.todoListId].map((el) => el.id !== task.id ? res.data.data.item : el),
           })
       })
    }

    const changeTodolist = (id: string, title: string) => {
       todolistsApi.changeTodolist({id, title}).then(() => {
           setTodolists(todolists.map((todolist) => (todolist.id === id  ? {...todolist, title} : todolist)))
       })
    }

    const  changeFilter = useCallback(( todolistId: TodolistType['id'], filter: FilterValuesType) => {
        const action = ChangeFilterTodoAC(todolistId, filter);
        dispatch(action);
    }, [dispatch])


    const deleteTodolist = (id: string) => {
     todolistsApi.deleteTodolist(id).then(() => {
         setTodolists(todolists.filter(todolist => todolist.id !== id))
     })
    }

    const addTodo = (title: string) => {
     todolistsApi.addTodo(title).then((res) => {
         const newTodolist = res.data.data.item
         setTodolists([newTodolist, ...todolists])
     })

    }


    return (
        <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        <Button color={"inherit"}>Login</Button>
                    </Toolbar>
                </AppBar>

                <Container fixed>
                    <Grid container style={{padding: '20px'}}>
                        <AddItemForm addItem={(title: string) => {
                            addTodo(title);
                        }}/>
                    </Grid>
                    <Grid  container spacing={3}>
                        const todolists = useAppSelector(selectTodolists)
                        const tasks = useAppSelector(selectTasks)
                        {todolists.map(tl => {
                            let tasksForTodolist = tasks[tl.id] || [];
                            return (
                                <Grid key={tl.id}>
                                    <Paper style={{padding: '10px'}}>
                                        <Todolist
                                            deleteTodolist={deleteTodolist}
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={tasksForTodolist}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeStatus={changeStatus}
                                            changeSpan={changeSpan}
                                            changeTodolist={changeTodolist}
                                            filter={tl.filter}
                                        ></Todolist>
                                    </Paper>
                                </Grid>
                            )
                        })
                        }
                    </Grid>
                </Container>
        </div>
    );
}
