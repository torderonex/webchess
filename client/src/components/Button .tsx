import {FC} from 'react'
import { Button as MuiButton , ButtonProps} from '@mui/material';

const Button : FC<ButtonProps> = ({ children, ...otherProps }) =>{
    return(
        <MuiButton {...otherProps}>{children}</MuiButton>
    );
}

export default Button;