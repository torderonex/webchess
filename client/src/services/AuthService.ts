import { AxiosResponse } from "axios";
import $api from "../http/api";
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService{

    static async registration(email : string , nickname : string, password : string) : Promise<AxiosResponse<AuthResponse>>{
        return $api.post('/account/register',{email: email,nickname: nickname,password: password})
}
    static async login(nickname : string, password : string) : Promise<AxiosResponse<AuthResponse>>{
        return $api.post('/account/login',{nickname,password})
    }

    static async logout() : Promise<void>{
        return $api.post('/account/logout')
    }

}