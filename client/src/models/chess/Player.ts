import { IUser } from "../IUser"
import { Colors } from "./Colors"

export class Player{
    user : IUser
    color : Colors

    constructor(user : IUser, color : Colors){
        this.user = user
        this.color = color
    }
}
