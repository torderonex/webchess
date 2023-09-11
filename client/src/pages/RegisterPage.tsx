import React, {FC, useContext, useState} from "react"
import { Context } from "..";
import { Typography, Card, Grid} from '@mui/material';
import Input from "../components/Input";
import Button from "../components/Button ";
import {Link} from "react-router-dom";
import MySnackbar from "../components/Snackbar";

const RegisterPage : FC = () =>{
    const [email , setEmail] = useState<string>('');
    const [nickname , setNickname] = useState<string>('');
    const [password , setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const {store} = useContext(Context);

    const [snackbarOpen, setSnackBarOpen] = useState<boolean>(false);
    const [snackbarErrorOpen, setSnackBarErrorOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    async function handle(){
        const statusCode = await store.registration(email, nickname,password)
        if (confirmPassword !== password){
          setErrorMsg("Error: passwords do not match");
          setSnackBarErrorOpen(true);
          return
        }
        if  (statusCode === 200){
          setSnackBarOpen(true);
        }else if (statusCode === 422){
          setErrorMsg("Error: validation error. Make sure your password is at least 5 characters long.")
          setSnackBarErrorOpen(true);
        }else if (statusCode === 409){
          setErrorMsg("Error: user with this nickanme or email is already exist.")
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
            Sign Up
        </Typography>
        <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        fullWidth
        required
      />
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
      <Input
        label="Password submit"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        fullWidth
        required
      />
      <Button onClick={() => handle()} type="submit" variant="outlined" color="primary">
        
        Sign up
      </Button>
      <Link style={{color:"white"}} to={"/login"}>
            <Button style={{marginLeft:"10px"}}>
                Log In
            </Button>
        </Link>
       </Card>
    
      <MySnackbar open={snackbarOpen} handleClose={() => {setSnackBarOpen(false)}} severity="success" msg="You have successfully registered, please verify your email to login."/>
      <MySnackbar open={snackbarErrorOpen} handleClose={() => {setSnackBarErrorOpen(false)}} severity="error" msg={errorMsg}/>

      </Grid>
  
    );
}

export default RegisterPage;