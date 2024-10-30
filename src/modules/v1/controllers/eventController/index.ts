import { NextFunction, Request, Response } from "express";
import apiResponse from "../../../../utils/apiResponse";
import EventService from "../../../../services/eventService";
import { BadRequestError } from "../../../../utils/errors";

export default class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { body } = req;

      const event = await this.eventService.create(body, Number(req.user.id));

      return apiResponse.successResponse(
        res,
        201,
        "Event created successfully",
        event
      );
    } catch (error) {
      next(error);
    }
  }

  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const events = await this.eventService.getAllEvents();
      return apiResponse.successResponse(
        res,
        200,
        "Retrieved events successfully",
        events
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
      const eventId = this.validateEventId(req.params.id);
      const event = await this.eventService.getEventById(eventId);
      return apiResponse.successResponse(
        res,
        200,
        "Event retrieved successfully",
        event
      );
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const eventId = this.validateEventId(req.params.id);
      const { body } = req;

      const updatedEvent = await this.eventService.update(
        eventId,
        body,
        Number(req.user.id)
      );
      return apiResponse.successResponse(
        res,
        200,
        "Event updated successfully",
        updatedEvent
      );
    } catch (error) {
      next(error);
    }
  }

  // Helper method to validate event ID
  private validateEventId(id: string): number {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      throw new BadRequestError("Event ID must be a valid number");
    }
    return eventId;
  }
}
