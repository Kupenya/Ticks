import { CreateEventData } from "../../interfaces/event.interface";
import { Event, User } from "../../db/models";
import { UserRole } from "../../utils/enums/user.enum";
import BaseService from "../base.service";
import { BadRequestError, UnauthorizedError } from "../../utils/errors";
class EventService extends BaseService<Event> {
  constructor() {
    super(Event, "Event");
  }

  public async create(data: CreateEventData, userId: number): Promise<Event> {
    const { name, date, totalTickets, availableTickets } = data;

    if (!name || !date || !totalTickets || !availableTickets) {
      throw new BadRequestError("All fields are required.");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new BadRequestError("User not found.");
    }

    if (user.role !== UserRole.admin) {
      throw new UnauthorizedError("Only admins can create events.");
    }

    const attributes = {
      name,
      date,
      totalTickets,
      availableTickets,
      createdBy: userId,
    };

    const event = await Event.create(attributes);

    return event;
  }
  public async getAllEvents(): Promise<Event[]> {
    return await this.getAll({});
  }

  public async getEventById(eventId: number): Promise<Event> {
    return await this.getByIdOrError(eventId);
  }

  public async update(
    eventId: number,
    data: CreateEventData,
    userId: number
  ): Promise<Event> {
    const event = await this.getByIdOrError(eventId);

    const user = await User.findByPk(userId);
    if (!user || user.role !== UserRole.admin) {
      throw new UnauthorizedError("Only admins can update events.");
    }
    await event.update(data);

    return event;
  }
}

export default EventService;
