import { JwtGenerator, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomErrors, RegisterUserDTO, UserEntity } from "../../domain";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDTO) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomErrors.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);

      //encriptacion de contraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      //JWT Para mantener la autenticacion del usuario

      const token = await JwtGenerator.generateJwt({
        id: user.id,
        email: user.email,
      });
      if (!token) throw CustomErrors.internalServer("Error generating token");
      //email de confirmacion

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: token,
      };
    } catch (error) {
      throw CustomErrors.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDTO) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomErrors.unAuthorize("Invalid email");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching) throw CustomErrors.unAuthorize("Invalid password");

    const { password, ...infoUser } = UserEntity.fromObject(user);

    const token = await JwtGenerator.generateJwt({
      id: user.id,
      email: user.email,
    });
    if (!token) throw CustomErrors.internalServer("Error generating token");

    return {
      user: infoUser,
      token,
    };
  }
}
