import  {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";


type EditTableSpanType = {
    value: string
    onChange: (NewValue: string) => void
    disabled?: boolean
}

export const EditableSpan = ({ value, onChange, disabled }: EditTableSpanType) =>  {
    let [EditMode, setEditMode] = useState<boolean>(false);
    let [title, setTitle] = useState('');

    const activateSpan = () => {
        setEditMode(true)
    setTitle(title);
    }
    const deActivateSpan = () =>{
        setEditMode(false)
        onChange(title);
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }


    return  EditMode
        ? <TextField variant={'standard'} value={title} onBlur={deActivateSpan} onChange={changeHandler} disabled={disabled} autoFocus/>
        : <span onDoubleClick={activateSpan} >{value}</span>
}