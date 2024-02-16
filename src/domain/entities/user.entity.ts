import { CustomErrors } from "../errors/custom.errors";



export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public avatar?: string,
    ){}

    static fromObject(object:{[key:string]:any}){
        const {id, _id, name, email, emailValidated, password, role, avatar} = object;

        if(!_id && !id){
            throw CustomErrors.badRequest('Missing id')
        }

        if(!name) throw CustomErrors.badRequest('Missing name')
        if(!email) throw CustomErrors.badRequest('Missing email')
        if(emailValidated=== undefined) throw CustomErrors.badRequest('Missing emailValidated')
        if(!password) throw CustomErrors.badRequest('Missing password')
        if(!role) throw CustomErrors.badRequest('Missing role')

        return new UserEntity(id || _id, name, email, emailValidated, password, role, avatar) 
    }
    
}