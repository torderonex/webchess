import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios, { Axios, AxiosError } from "axios";
import $api, { API_URL } from "../http/api";

class AuthStore{
    user = {} as IUser;
    isAuth = false;

    constructor(){
        makeAutoObservable(this);
    }

    setAuth(bool : boolean){
        this.isAuth = bool;
    }

    setUser(user : IUser){
        this.user = user;
    }

    async registration(email : string, nickname : string, password : string){
        try{
            const resp = await $api.post('http://localhost:8080/api/account/register',{email: email,nickname: nickname,password: password})
            return resp.status
        }catch(e : any){
            return e.response.status;
        }
    }

    async login(nickname : string, password : string){
        try{
            const response = await $api.post('http://localhost:8080/api/account/login',{nickname: nickname,password: password})
            localStorage.setItem('token', response.data.tokens.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return response.status
        }catch(e : any){
            return e.response.status
        }
    }

    async logout(){
        try{
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        }catch(e){
            console.log(e);
        }
    }

    async checkAuth(){
        try{
            const response = await axios.get(`${API_URL}/account/refresh`, {withCredentials: true,});
            localStorage.setItem('token',response.data.tokens.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch(e){
            console.log(e);
        }
    }

}

export default AuthStore;