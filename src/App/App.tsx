import './App.css';
import {TaskType, Todolist} from '../Todolist.tsx';
import {AddItemForm} from "../common/components/AddItemForm/AddItemForm.tsx";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useTodolists} from "./hooks/useTodolists.tsx";
import {useTasks} from "./hooks/useTasks.tsx";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TaskStateType = {
    [todolistId: string]: TaskType[]
}

export const App = () => {
    const {
        tasks,
        removeTask,
        addTask,
        changeStatus,
        changeSpan,
        completeRemoveTasksForTodolists,
        addStateForNewTodolist
    } = useTasks()

    const {
        todolists,
        changeTodolist,
        changeFilter,
        deleteTodolist,
        addTodo
    } = useTodolists(completeRemoveTasksForTodolists, addStateForNewTodolist)

    function getFilteredTasks(tasks: TaskType[], filter: FilterValuesType) {
        switch (filter) {
            case 'active':
                return tasks.filter(t => !t.isDone);
            case 'completed':
                return tasks.filter(t => t.isDone);
            case 'all':
            default:
                return tasks;
        }
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
                        {todolists.map(tl => {
                            const filteredTasks = getFilteredTasks(tasks[tl.id], tl.filter)
                            return (
                                <Grid key={tl.id}>
                                    <Paper style={{padding: '10px'}}>
                                        <Todolist
                                            deleteTodolist={deleteTodolist}
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={filteredTasks}
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
