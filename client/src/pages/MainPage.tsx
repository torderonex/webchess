import React, {FC, useContext, useState} from 'react'
import { Typography, Grid, Button} from '@mui/material';
import GameService from '../services/GameService';
import { Context } from '..';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
 import Input from '../components/Input';
const MainPage : FC = () =>{
    
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [lobbyID, setLobbyID] = useState<string>("");

    const {store} = useContext(Context);
    const navigator = useNavigate();
    async function createLobby(){
        if (store.isAuth){
            try{
                const response = await GameService.create(store.user.ID); 
                navigator(`/game/${response.data.lobby_id}`);
            }catch(e){
                console.log(e);
            }
        }else{
            navigator("/login");
        }

    }
    return(
        <Grid
        container
        alignItems="center"
        style={{ height: '80vh', display: 'flex', justifyContent:"center" }}
      >
        <Typography  variant="h4" gutterBottom>
            <img style={{width:"300px", height:"300px"}} src='standardboard.png'/>
            <div style={{display:"flex", flexDirection:"column"}}>
                <Button onClick={() => {createLobby()}} variant="outlined">Create game</Button>
                <Button style={{marginTop:"4px"}} variant="outlined" onClick={() => setOpenModal(true)}>Join game</Button>
            </div>
        <Modal open={openModal} setOpen={setOpenModal} title={<></>} body={
        <React.Fragment>
            <Input onChange={(e) => {(setLobbyID(e.target.value))}} value={lobbyID} label='LobbyID'/> 
            <Button onClick={() => navigator(`/game/` + lobbyID)} variant="outlined" style={{marginLeft:"5px"}}>Submit</Button>
        </React.Fragment>
        }></Modal>
        </Typography>
    </Grid>
    );
}
export default MainPage;