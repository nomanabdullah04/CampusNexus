export enum EventCategory {
  ACADEMIC = "ACADEMIC",
  CULTURAL = "CULTURAL",
  SPORTS = "SPORTS",
  TECH = "TECH",
  SOCIAL = "SOCIAL",
  OTHER = "OTHER",
}

export enum EventStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IEvent {
  id?: number;
  adminId: number;
  title: string;
  description?: string;
  category: EventCategory;
  eventDate: Date;
  location?: string;
  image?: string;
  status: EventStatus;
}

export interface IEventRegistration {
  id?: number;
  eventId: number;
  userId: number;
}
