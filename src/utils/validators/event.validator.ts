import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createEventSchema = Joi.object({
  name: Joi.string().min(1).required(),
  date: Joi.date().iso().required(),
  totalTickets: Joi.number().integer().min(1).required(),
  availableTickets: Joi.number()
    .integer()
    .min(0)
    .required()
    .max(Joi.ref("totalTickets")),
});

const updateEventSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  date: Joi.date().iso().optional(),
  totalTickets: Joi.number().integer().min(1).optional(),
  availableTickets: Joi.number()
    .integer()
    .min(0)
    .optional()
    .max(Joi.ref("totalTickets")),
}).or("name", "date", "totalTickets", "availableTickets");

export const validateCreateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createEventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateUpdateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateEventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default {
  validateCreateEvent,
  validateUpdateEvent,
};
