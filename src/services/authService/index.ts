import { User } from "../../db/models";
import { UserRole } from "../../utils/enums/user.enum";
import { BadRequestError, UnauthorizedError } from "../../utils/errors";
import userService from "../userService";
import bcrypt from "bcryptjs";
import jwtUtil from "../../utils/jwtUtil";
import {
  CreateUserData,
  CreateAdminData,
} from "../../interfaces/user.interface";
import { Op } from "sequelize";

class AuthService {
  public async login(user: User): Promise<{ user: User; accessToken: string }> {
    // generate access token
    const accessToken = jwtUtil.generate(user);

    return { user, accessToken };
  }

  public async register(data: CreateUserData): Promise<User> {
    const { firstName, lastName, email, password } = data;

    const whereQuery = {
      [Op.or]: [{ email }],
    };

    const userExists = await userService.get(whereQuery);

    if (userExists) {
      throw new BadRequestError("User already exists");
    }

    const attributes = {
      firstName,
      lastName,
      email,
      password,
      role: UserRole.user,
    };

    const user = await User.create(attributes);
    return user;
  }

  public async registerAdmin(data: CreateAdminData): Promise<User> {
    const { firstName, lastName, email, password } = data;

    const whereQuery = {
      [Op.or]: [{ email }],
    };
    const userExists = await userService.get(whereQuery);

    if (userExists) {
      throw new BadRequestError("User already exists");
    }

    const attributes = {
      firstName,
      lastName,
      email,
      password,
      role: UserRole.admin,
    };

    const user = await User.create(attributes);

    return user;
  }
}

export default new AuthService();
