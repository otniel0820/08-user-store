import { regularExps } from "../../../config";



export class LoginUserDTO{

    constructor(
        public email: string,
        public password: string,
    ){}

    static create(object: {[key:string]: any}):[string?, LoginUserDTO?]{
        const {email, password} = object;

        if(!email) return ['Missin Email']
        if(!regularExps.email.test(email)) return ['Email is not valid']
        if(!password) return ['Missin password']
        if(password.length <6) return ['Password too short']


        return [undefined, new LoginUserDTO(email, password)]
    }
}