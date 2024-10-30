import { config } from "dotenv";
import Joi from "joi";
import { Sequelize } from "sequelize";

config();

const envVarsSchema = Joi.object()
  .keys({
    DB_URI: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    V1_URL: Joi.string().required(),
    ADMIN_URL: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

class ServerConfig {
  // V1 URL
  public V1_URL = envVars.V1_URL;
  // Admin URL
  public ADMIN_URL = envVars.ADMIN_URL;
  //DB DETAILS
  public DB = {
    URI: envVars.DB_URI,
    PORT: envVars.DB_PORT,
    USER: envVars.DB_USERNAME,
    PASSWORD: envVars.DB_PASSWORD,
    HOST: envVars.DB_HOST,
    NAME: envVars.DB_NAME,
  };

  public PORT = envVars.PORT;

  public DBConfig(): Sequelize {
    const sequelize: Sequelize = new Sequelize(this.DB.URI, {
      dialect: "mysql",
      logging: false,
    });

    return sequelize;
  }

  // Migration Object (Controls Migration Connection)
  public DBMigrationConfig = {
    development: {
      url: this.DB.URI,
      dialect: "postgres",
    },
  };
  // JWT Object
  public JWTKeys = {
    encryptKey: envVars.ENCRYPT_KEY,
    decryptKey: envVars.DECRYPT_KEY,
  };
}

export default new ServerConfig();
