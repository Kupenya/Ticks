import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createBookingSchema = Joi.object({
  eventId: Joi.number().required(),
  ticketsReserved: Joi.number().min(1).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().optional(),
});

export const validateCreateBooking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default {
  createBookingSchema,
  validateCreateBooking,
};
