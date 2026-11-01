import React from "react";
import {IconButton, TextField} from "@mui/material";
import {ControlPoint} from "@mui/icons-material";
import {useAddItemForm} from "./hooks/useAddItemForm.tsx";

export type CreateSampleType = {
    addItem: (title: string) => void
}

export const  AddItemForm = React.memo ((props: CreateSampleType)=> {

   const {title,
       onChangeHandler,
       onKeyEnter,
       error,
       addTask} = useAddItemForm(props.addItem)

    return <div>
        <TextField value={title}
                   variant={"outlined"}
                   label={'Type value'}
                   onChange={onChangeHandler}
                   onKeyDown={onKeyEnter}
                   error={!!error}
                   helperText={error}
        />
        <IconButton onClick={addTask}>
            <ControlPoint color={'primary'}/>
        </IconButton>
    </div>
}
)