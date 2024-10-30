import { NextFunction, Request, Response } from "express";
import apiResponse from "../../../../utils/apiResponse";
import bookingService from "../../../../services/bookingService";
import { BadRequestError } from "../../../../utils/errors";
import { BookingStatus } from "../../../../utils/enums/booking.enum";
import { BookingCancellationData } from "../../../../interfaces/booking.interface";
export default class BookingController {
  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { userId, bookingId } = req.query;

      if (userId) {
        // Authenticated user: Get all bookings
        const bookings = await bookingService.getBookings(Number(userId));
        return apiResponse.successResponse(
          res,
          200,
          "Retrieved bookings successfully",
          bookings
        );
      } else if (bookingId) {
        // Unauthenticated user: Get specific booking
        const booking = await bookingService.getBookings(
          undefined,
          Number(bookingId)
        );
        return apiResponse.successResponse(
          res,
          200,
          "Booking retrieved successfully",
          booking
        );
      }

      throw new BadRequestError("Either userId or bookingId must be provided.");
    } catch (error) {
      next(error);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { body } = req;

      const { eventId, ticketsReserved, firstName, lastName, email } = body;
      if (!eventId || !ticketsReserved || !firstName || !lastName) {
        throw new BadRequestError(
          "eventId, ticketsReserved, firstName, and lastName are required."
        );
      }

      const isAuthenticated = body.userId !== undefined;
      const booking = await bookingService.createBooking(
        {
          eventId,
          userId: isAuthenticated ? body.userId : null,
          firstName,
          lastName,
          email: isAuthenticated ? undefined : email,
          ticketsReserved,
          bookingStatus: BookingStatus.Pending,
        },
        isAuthenticated
      );

      // Check if the booking is a string
      if (typeof booking === "string") {
        // Return a message if the user is on the waitlist
        return apiResponse.successResponse(res, 200, booking);
      }
      return apiResponse.successResponse(
        res,
        201,
        "Booking created successfully",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const bookingId = this.validateBookingId(req.params.id);

      const booking = await bookingService.getBookingById(bookingId);
      return apiResponse.successResponse(
        res,
        200,
        "Booking retrieved successfully",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  public async cancelBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { bookingId, ticketsToCancel } = req.body;

      if (!ticketsToCancel || ticketsToCancel <= 0) {
        return res.status(400).json({
          message: "Please specify a valid number of tickets to cancel.",
          error: true,
        });
      }

      const cancellationData: BookingCancellationData = {
        bookingId,
        ticketsToCancel,
      };

      const booking = await bookingService.cancelBooking(cancellationData);

      return res.status(200).json({
        message: "Booking canceled successfully.",
        error: false,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getEventStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { eventId } = req.params;

    try {
      // Call the service method to get event status
      const status = await bookingService.getEventStatus(Number(eventId));

      return res.status(200).json({
        message: "Event status retrieved successfully.",
        error: false,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to validate booking ID
  private validateBookingId(id: string): number {
    const bookingId = Number(id);
    if (isNaN(bookingId)) {
      throw new BadRequestError("Booking ID must be a valid number.");
    }
    return bookingId;
  }
}
