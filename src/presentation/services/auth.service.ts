import { UserModel } from "../../data";
import { CustomErrors, RegisterUserDTO, UserEntity } from "../../domain";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDTO) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomErrors.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);
      await user.save();


      //encriptacion de contraseña


      //JWT Para mantener la autenticacion del usuario


      //email de confirmacion 

      const {password, ...userEntity} = UserEntity.fromObject(user)

      return {
        user: userEntity,
        token: 'ABC'
      };
    } catch (error) {
      throw CustomErrors.internalServer(`${error}`);
    }

    return "Registered successfully";
  }
}
