import {FC} from 'react'
import {Button as MuiButton, Modal as MuiModal, Box,Typography} from '@mui/material';

export interface ModalProps{
    open :  boolean,
    setOpen : (a : boolean) => void,
    title : React.ReactElement
    body : React.ReactElement
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Modal : FC<ModalProps> = ({open, setOpen,  title, body}, ) =>{
    return(
        <MuiModal
        open={open}
        onClose={() => setOpen(false)}
        >
        <Box sx={style}>
        <Typography style={{display:"flex", alignItems:"center", justifyContent:"center"}} variant="h6" component="h2">
            {title}
        </Typography>
        <Typography style={{display:"flex", alignItems:"center", justifyContent:"center"}}sx={{ mt: 2 }}>
            {body}
        </Typography>
        </Box>
        </MuiModal>
    );
}

export default Modal;
