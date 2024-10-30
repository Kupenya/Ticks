import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { BookingAttribute } from "../../interfaces/booking.interface";
import { BookingStatus } from "../../utils/enums/booking.enum";
import Event from "./event.model";
import User from "./user.model";

class Booking
  extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>>
  implements BookingAttribute
{
  declare id: number;
  declare eventId: number;
  declare userId?: number | null;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare ticketsReserved: number;
  declare bookingStatus: BookingStatus;
}

export function initBooking(connection: Sequelize) {
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,
          key: "id",
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ticketsReserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookingStatus: {
        type: DataTypes.ENUM(...Object.values(BookingStatus)),
        allowNull: false,
        defaultValue: BookingStatus.Pending,
      },
    },
    {
      sequelize: connection,
      tableName: "bookings",
      timestamps: true,
    }
  );
}

export function associateBooking() {
  Booking.belongsTo(Event, {
    foreignKey: { name: "eventId", allowNull: false },
    as: "events",
    onDelete: "CASCADE",
  });

  Booking.belongsTo(User, {
    foreignKey: { name: "userId", allowNull: true },
    as: "users",
    onDelete: "SET NULL",
  });
}

export default Booking;
