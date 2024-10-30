import { BookingStatus } from "../utils/enums/booking.enum";

export interface BookingAttribute {
  id: number;
  eventId: number;
  userId?: number | null;
  firstName: string;
  lastName: string;
  email: string;
  ticketsReserved: number;
  bookingStatus: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookingData {
  eventId: number;
  userId?: number | null;
  firstName: string;
  lastName: string;
  email: string;
  ticketsReserved: number;
  bookingStatus: BookingStatus;
}

export interface BookingCancellationData {
  bookingId: number;
  ticketsToCancel: number;
}
