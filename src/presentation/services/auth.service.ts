import { JwtGenerator, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomErrors, RegisterUserDTO, UserEntity } from "../../domain";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

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

      await this.sendEmailValidationLink(user.email)

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

  private sendEmailValidationLink = async(email: string)=>{

    const token = await JwtGenerator.generateJwt({email})
    if(!token) throw CustomErrors.internalServer("Error generating token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html= `
    <h1>Validate your Email</h1>
    <p>Click on the link below to validate your email</p>
    <a href="${link}">Validate your ${email} account</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if(!isSent) throw CustomErrors.internalServer("Error sending email");

    return true
  }

  public validateEmail = async(token: string)=>{
   const payload = await JwtGenerator.validateToken(token)
   if(!payload) throw CustomErrors.unAuthorize("Invalid token");

   const {email} = payload as {email: string};
   if(!email) throw CustomErrors.internalServer('Email not in token')

   const user = await UserModel.findOne({email});
   if(!user) throw CustomErrors.badRequest("Email not found");

   user.emailValidated = true
   await user.save()

   return true
  }
  
}
