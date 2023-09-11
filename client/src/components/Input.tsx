import {FC} from 'react'
import { TextField as MuiInput, TextFieldProps} from '@mui/material';

const Input : FC<TextFieldProps> = ({children, ...otherProps}) =>{
    return(
        <MuiInput  {...otherProps}>{children}</MuiInput>
    );
}

export default Input;