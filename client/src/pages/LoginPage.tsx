import React, {FC, useContext, useState} from "react"
import { Context } from "..";
import { Typography, Card, Grid} from '@mui/material';
import Input from "../components/Input";
import Button from "../components/Button ";
import {Link, useNavigate} from 'react-router-dom';
import MySnackbar from "../components/Snackbar";

const LoginPage : FC = () =>{
    const [nickname , setNickname] = useState<string>('');
    const [password , setPassword] = useState<string>('');

    const {store} = useContext(Context);

    const [snackbarErrorOpen, setSnackBarErrorOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const nav = useNavigate();

    async function handle(){
      const statusCode = await store.login(nickname,password)
      
      if  (statusCode === 200){
        nav("/");
      }else if (statusCode === 404){
        setErrorMsg("Error: user with this nickname not found")
        setSnackBarErrorOpen(true);
      }else if (statusCode === 401){
        setErrorMsg("Error: email is not activated, please verify your account.");
        setSnackBarErrorOpen(true);
      }else{
        setErrorMsg("Error: internal server error.")
        setSnackBarErrorOpen(true);
      }
  }
    
    return (
        <Grid
        container
        alignItems="center"
        style={{ height: '80vh', display: 'flex', justifyContent:"center" }}
      >
      <Card style={{ padding: '20px', maxWidth: '400px' }}>
        <Typography variant="h4" gutterBottom>
            Log In
        </Typography>
        
        <Input
        label="Nickname"
        type="text"
        value={nickname}
       onChange={(e) => setNickname(e.target.value)}
        margin="normal"
        fullWidth
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
        required
      />
      
      <Button onClick={() => handle()} type="submit" variant="outlined" color="primary">
        Log in
      </Button>
        <Link style={{color:"white"}} to={"/signup"}>
            <Button  style={{marginLeft:"10px"}}>
                Sign Up
            </Button>
        </Link>
       </Card>
      <MySnackbar open={snackbarErrorOpen} handleClose={() => {setSnackBarErrorOpen(false)}} severity="error" msg={errorMsg}/>
    </Grid>
    );
}

export default LoginPage;