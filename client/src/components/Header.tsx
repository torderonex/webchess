import React, { useContext } from 'react';
import {Toolbar, Typography, AppBar} from '@mui/material';
import Button from './Button '
import {Link} from 'react-router-dom'
import { Context } from '..';
import {observer} from 'mobx-react-lite'

function Header() {

const {store} = useContext(Context);
const profileLink = store.isAuth ?  
<React.Fragment>
    <Link style={{color:"white"}} to={`/profile/${store.user.ID}`}><Button style={{marginRight:"10px"}} color="inherit">{store.user.nickname}</Button></Link>
    <Button onClick={() => {store.logout()}} style={{marginRight:"10px"}} color="inherit">Logout</Button>
</React.Fragment>
    : <Link style={{color:"white"}} to={"signup"}><Button style={{marginRight:"10px"}} color="inherit">Log In</Button></Link>
  return (
    <div >
      <AppBar position="static">
        <Toolbar style={{display:"flex", textAlign:"center", justifyContent:"space-between"}}>
          <div style={{display:"flex"}}>
            <img style={{width:"40px", height:"40px"}} src="logo.png"></img>
            <Typography variant="h6" >
                Web-Chess
            </Typography>
            </div>
          <div>
          <Link style={{color:"white"}} to={"/"}><Button style={{marginRight:"10px"}} color="inherit">Home</Button></Link>
          <Link style={{color:"white"}} to={"/about"}><Button style={{marginRight:"10px"}} color="inherit">About</Button></Link>
            {profileLink}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default observer(Header);