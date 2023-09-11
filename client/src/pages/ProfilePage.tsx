import {FC, useEffect, useState} from 'react'
import React from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import UserService from '../services/UserService';
import NotFoundPage from './NotFoundPage';
import { IUser } from '../models/IUser';
import { format } from 'date-fns';

const ProfilePage : FC = () => {

    const {id} = useParams();
    const [userInfo, setUserInfo] = useState<IUser>({} as IUser);
    const [errorState, setErrorState] = useState<boolean>(false);

    const fetchUserInfo = async () =>{
        try{
            const resp = await UserService.getUserInfo(parseInt(id + ''));
            setUserInfo(resp.data)
        }catch(err){
            console.log(err);
            setErrorState(true);
        }
    }
    
    useEffect(() => {
        fetchUserInfo();
      }, [id]);
      if (errorState){
        return <NotFoundPage/>;
      }
      return (
        <Grid
          container
          alignItems="center"
          style={{ height: '80vh', display: 'flex', justifyContent: 'center' }}
        >
          {Object.keys(userInfo).length > 0 ? ( 
            <Card style={{ padding: '20px', maxWidth: '400px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Profile
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      Nickname: {userInfo.nickname}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      Registration date: {format(new Date(userInfo.registration_date.split('.')[0]), 'dd.MM.yyyy HH:mm')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Rating: {userInfo.mmr}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            //loading
            <CircularProgress color="success" />
          )}
        </Grid>
      );
};

export default ProfilePage;