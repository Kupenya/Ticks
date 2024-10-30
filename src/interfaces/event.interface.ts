export interface EventAttribute {
  id: number;
  name: string;
  date: Date;
  totalTickets: number;
  availableTickets: number;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEventData {
  name: string;
  date: Date;
  totalTickets: number;
  availableTickets: number;
}
