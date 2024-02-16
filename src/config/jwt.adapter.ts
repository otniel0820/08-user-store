import jwt from "jsonwebtoken";
import { envs } from "./envs";

//dependencia oculta 
const JWT_SEED= envs.JWT_SEED;

export class JwtGenerator {
  static async generateJwt(payload: any, duration: string = "2h") {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        return resolve(token)
      });
    });
  }

  static validateToken(token: string) {
    return;
  }
}
