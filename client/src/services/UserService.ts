import { AxiosResponse } from "axios";
import $api from "../http/api";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/IUser";

export default class UserService{
    static async getUserInfo(id : number) : Promise<AxiosResponse<IUser>>{
        return $api.get(`/account/userinfo/${id}`);
    }
}