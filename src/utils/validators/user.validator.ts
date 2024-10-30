import Joi, { ValidationResult } from "joi";
import { passwordPattern, validationOption } from ".";
import { Request } from "express";

class UserValidatorUtil {
  private validatorOption = validationOption;

  public createSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string().email().required().label("Email"),
      password: Joi.string()
        .min(8)
        .regex(passwordPattern)
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        })
        .label("Password"),
    });

    return schema.validate(req.body, this.validatorOption);
  };

  public registerSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string().email().required().label("Email"),
      password: Joi.string()
        .min(8)
        .regex(passwordPattern)
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        })
        .label("Password"),
    });

    return schema.validate(req.body, this.validatorOption);
  };
  public loginSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string()
        .min(8)
        .regex(passwordPattern)
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        })
        .label("Password"),
    });

    return schema.validate(req.body, this.validatorOption);
  };
}

export default new UserValidatorUtil();
