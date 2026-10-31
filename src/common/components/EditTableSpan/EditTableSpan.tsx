import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";


type EditTableSpanType = {
    title: string
    onChange: (NewValue: string) => void
}

export const EditTableSpan = React.memo( function  (props: EditTableSpanType) {
    let [EditMode, setEditMode] = useState<boolean>(false);
    let [title, setTitle] = useState('');

    const activateSpan = () => {
        setEditMode(true)
    setTitle(props.title);
    }
    const deActivateSpan = () =>{
        setEditMode(false)
        props.onChange(title);
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }


    return  EditMode
        ? <TextField variant={'standard'} value={title} onBlur={deActivateSpan} onChange={changeHandler} autoFocus/>
        : <span onDoubleClick={activateSpan}>{props.title}</span>
})