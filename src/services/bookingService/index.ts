import { Transaction } from "sequelize";
import {
  CreateBookingData,
  BookingCancellationData,
} from "../../interfaces/booking.interface";
import { BookingStatus } from "../../utils/enums/booking.enum";
import { User, Event, Booking } from "../../db/models";
import BaseService from "../base.service";
import { BadRequestError, NotFoundError } from "../../utils/errors";

class BookingService extends BaseService<Booking> {
  constructor() {
    super(Booking, "Booking");
  }

  public defaultIncludeables() {
    return [
      this.generateIncludeable(User, "user", [
        "id",
        "firstName",
        "lastName",
        "email",
      ]),
      this.generateIncludeable(Event, "event", ["id", "name", "totalTickets"]),
    ];
  }

  private async updateEventTickets(
    event: Event,
    ticketsReserved: number,
    transaction: Transaction
  ) {
    await event.update(
      { availableTickets: event.availableTickets - ticketsReserved },
      { transaction }
    );
  }

  public async createBooking(
    data: CreateBookingData,
    isAuthenticated: boolean
  ): Promise<Booking | string> {
    const transaction = await Booking.sequelize!.transaction();

    try {
      const { eventId, userId, firstName, lastName, email, ticketsReserved } =
        data;

      const event = await Event.findOne({
        where: { id: eventId },
        transaction,
      });

      if (!event) throw new NotFoundError("Event not found");

      if (event.availableTickets >= ticketsReserved) {
        data.bookingStatus = BookingStatus.Completed;

        await this.updateEventTickets(event, ticketsReserved, transaction);
      } else {
        if (event.availableTickets === 0) {
          data.bookingStatus = BookingStatus.Waitlisted;
          console.log("No tickets available, user will be waitlisted.");
          data.ticketsReserved = 0;
        } else {
          throw new BadRequestError(
            "Not enough tickets available to fulfill your request."
          );
        }
      }

      if (isAuthenticated && userId) {
        const user = await User.findOne({ where: { id: userId }, transaction });
        if (!user) throw new NotFoundError("Authenticated user not found");
        data.email = user.email;
      }

      // Create booking
      const booking = await Booking.create(
        {
          eventId,
          userId: isAuthenticated ? userId : null,
          firstName,
          lastName,
          email,
          ticketsReserved: data.ticketsReserved,
          bookingStatus: data.bookingStatus,
        },
        { transaction }
      );

      await transaction.commit();
      if (data.bookingStatus === BookingStatus.Waitlisted) {
        return "Tickets are sold out; you are on the waitlist.";
      }
      return booking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getBookings(
    userId?: number,
    bookingId?: number
  ): Promise<Booking | Booking[]> {
    if (userId) {
      // Authenticated: Get all bookings by userId
      return this.getAll({ userId }, this.defaultIncludeables());
    } else if (bookingId) {
      // Unauthenticated: Get specific booking by ID
      return this.getOrError({ id: bookingId }, this.defaultIncludeables());
    }
    throw new BadRequestError("Either userId or bookingId must be provided.");
  }

  public async getBookingById(id: number): Promise<Booking> {
    return this.getByIdOrError(id, this.defaultIncludeables());
  }

  public async cancelBooking(data: BookingCancellationData): Promise<Booking> {
    const transaction = await Booking.sequelize!.transaction();
    try {
      const { bookingId, ticketsToCancel } = data;

      const booking = await Booking.findOne({
        where: { id: bookingId },
        transaction,
      });
      if (!booking) throw new NotFoundError("Booking not found");

      if (ticketsToCancel > booking.ticketsReserved) {
        throw new BadRequestError("Cannot cancel more tickets than reserved.");
      }

      booking.ticketsReserved -= ticketsToCancel;

      if (booking.ticketsReserved === 0) {
        booking.bookingStatus = BookingStatus.Canceled;
      }
      await booking.save({ transaction });

      const event = await Event.findOne({
        where: { id: booking.eventId },
        transaction,
      });
      if (event) {
        await event.update(
          {
            availableTickets: event.availableTickets + ticketsToCancel,
          },
          { transaction }
        );

        while (event.availableTickets > 0) {
          const waitlistedBookings = await Booking.findAll({
            where: {
              eventId: booking.eventId,
              bookingStatus: BookingStatus.Waitlisted,
            },
            limit: 1,
            order: [["createdAt", "ASC"]],
            transaction,
          });

          if (waitlistedBookings.length === 0) {
            break;
          }

          const waitlistedBooking = waitlistedBookings[0];

          if (event.availableTickets >= waitlistedBooking.ticketsReserved) {
            waitlistedBooking.bookingStatus = BookingStatus.Completed;
            await waitlistedBooking.save({ transaction });

            event.availableTickets -= waitlistedBooking.ticketsReserved;
            await event.save({ transaction });
          } else {
            break;
          }
        }
      }

      await transaction.commit();
      return booking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getEventStatus(
    eventId: number
  ): Promise<{ availableTickets: number; waitlistedCount: number }> {
    const event = await Event.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundError("Event not found.");
    }

    const waitlistedCount = await Booking.count({
      where: {
        eventId: event.id,
        bookingStatus: BookingStatus.Waitlisted,
      },
    });

    return {
      availableTickets: event.availableTickets,
      waitlistedCount,
    };
  }
}

export default new BookingService();
