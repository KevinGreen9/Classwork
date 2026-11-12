import {useAppDispatch} from "../common/hooks";
import {createTodolistTC} from "../features/todolists/model/todolistsSlice.ts";
import {AddItemForm} from "../common/components";
import {Todolists} from "../features/todolists/ui/Todolists/Todolists.tsx";
import {Container, Grid} from "@mui/material";


export const Main = () => {
    const dispatch = useAppDispatch()

    const createTodolist = (title: string) => {
        dispatch(createTodolistTC(title))
    }

    return (
        <Container maxWidth={"lg"}>
            <Grid container sx={{ mb: "30px" }}>
                <AddItemForm addItem={createTodolist} />
            </Grid>
            <Grid container spacing={4}>
                <Todolists />
            </Grid>
        </Container>
    )
}
