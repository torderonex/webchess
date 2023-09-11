import { IUser } from "../IUser";

export interface AuthResponse{
    user : IUser,
    tokens : ITokens,
}

export interface ITokens{
    accessToken : string,
    refreshtoken : string,
}