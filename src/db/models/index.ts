import { Sequelize } from "sequelize";
import User, { associateUser, initUser } from "./user.model";
import Event, { associateEvent, initEvent } from "./event.model";
import Booking, { associateBooking, initBooking } from "./booking.model";

async function associate() {
  try {
    associateUser();
    associateEvent();
    associateBooking();
  } catch (error) {
    console.error("Model association error:", error);
  }
}

export async function init(connection: Sequelize) {
  try {
    initUser(connection);
    initBooking(connection);
    initEvent(connection);
    await associate();
  } catch (error) {
    console.error("Model initialization error:", error);
  }
}

export { User, Event, Booking };
