import {FC} from 'react'
import { Typography, Grid, } from '@mui/material';
import Button from '../components/Button ';

const NotFoundPage : FC = () =>{
    return(
        <Grid
        container
        alignItems="center"
        style={{ height: '80vh', display: 'flex', justifyContent:"center", flexDirection:"column" }}
      >
        <Typography style={{display: 'flex', alignItems:"center", justifyContent:"center", flexDirection:"column" }}variant="h4" gutterBottom>
            <span style={{color:"#006400", fontSize:"100px"}}>404 ERROR</span> <br/> Page not found. =(
        </Typography>
        {/* <Button style={{color:'#006400', textDecoration:"none"}}>Maybe you want to back home?</Button> */}
    </Grid>
    );
}

export default NotFoundPage;