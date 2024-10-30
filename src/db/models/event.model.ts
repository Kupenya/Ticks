import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { EventAttribute } from "../../interfaces/event.interface";
import User from "./user.model";
import Booking from "./booking.model";

class Event
  extends Model<InferAttributes<Event>, InferCreationAttributes<Event>>
  implements EventAttribute
{
  declare id: number;
  declare name: string;
  declare date: Date;
  declare totalTickets: number;
  declare availableTickets: number;
  declare createdBy: number;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export function initEvent(connection: Sequelize) {
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      availableTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize: connection,
      timestamps: true,
      tableName: "events",
    }
  );
}

export function associateEvent() {
  Event.hasMany(Booking, {
    foreignKey: { name: "eventId", allowNull: false },
    as: "bookings",
    onDelete: "CASCADE",
  });

  Event.belongsTo(User, {
    foreignKey: { name: "createdBy", allowNull: false },
    as: "admin",
    onDelete: "CASCADE",
  });
}
export default Event;
