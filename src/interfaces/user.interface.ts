import { UserRole } from "../utils/enums/user.enum";

export interface UserAttribute {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateAdminData extends Omit<CreateUserData, "role"> {
  role: UserRole.admin;
}
