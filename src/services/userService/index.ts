import { User } from "../../db/models";
import { UserRole } from "../../utils/enums/user.enum";
import { BadRequestError, UnauthorizedError } from "../../utils/errors";
import { CreateUserData } from "../../interfaces/user.interface";
import BaseService from "../base.service";
import bcrypt from "bcryptjs";

class UserService extends BaseService<User> {
  constructor() {
    super(User, "User");
  }

  private userModel = User;

  public async create(data: CreateUserData): Promise<User> {
    const { firstName, lastName, email, password } = data;

    const attributes = {
      firstName,
      lastName,
      email,
      password,
      role: data.role || UserRole.user,
    };

    const user = await this.userModel.create(attributes);

    return user;
  }

  public async getByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User> {
    const user = await this.userModel.scope("withPassword").findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    return user;
  }
}

export default new UserService();
