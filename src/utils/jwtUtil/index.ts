import jwt from "jsonwebtoken";
import { Model } from "sequelize";
import { DecodedToken } from "../../interfaces/jwt.interface";
import config from "../../config";

class TokenUtil {
  private EncryptKey: string;
  private DecryptKey: string;

  constructor() {
    this.EncryptKey = config.JWTKeys.encryptKey || "";
    this.DecryptKey = config.JWTKeys.decryptKey || "";
  }

  private getAlgorithm(): jwt.Algorithm {
    return "HS256";
  }

  public generate(data: Model, expiresIn: string = "7d"): string {
    const algorithm = this.getAlgorithm();
    const token = jwt.sign(data.toJSON(), this.EncryptKey, {
      algorithm: algorithm,
      expiresIn,
    });

    return token;
  }

  public verify(token: string): DecodedToken {
    const algorithm = this.getAlgorithm();
    try {
      const payload = jwt.verify(token, this.DecryptKey, {
        algorithms: [algorithm],
      }) as unknown as Model;

      return { payload, expired: false };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          payload: null,
          expired: true,
        };
      }
      return {
        payload: null,
        expired: error.message,
      };
    }
  }
}

export default new TokenUtil();
