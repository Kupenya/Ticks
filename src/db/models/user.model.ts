import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { UserAttribute } from "../../interfaces/user.interface";
import { UserRole } from "../../utils/enums/user.enum";
import bcrypt from "bcryptjs";
import Event from "./event.model";
import Booking from "./booking.model";

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttribute
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export function initUser(connection: Sequelize) {
  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      timestamps: true,
      defaultScope: { attributes: { exclude: ["password"] } },
      scopes: { withPassword: { attributes: { include: ["password"] } } },
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
      tableName: "users",
    }
  );
}

export function associateUser() {
  User.hasMany(Booking, {
    foreignKey: { allowNull: true, name: "userId" },
    as: "bookings",
    onDelete: "CASCADE",
  });

  User.hasMany(Event, {
    foreignKey: { allowNull: false, name: "createdBy" },
    as: "events",
    onDelete: "CASCADE",
  });
}

export default User;
