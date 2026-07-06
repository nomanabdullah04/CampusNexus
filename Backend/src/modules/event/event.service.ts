import httpStatus from "http-status-codes";
import { Op } from "sequelize";
import AppError from "../../errorHelpers/AppError";
import { IEvent, EventStatus } from "./event.interface";
import { Event, EventRegistration } from "./event.model";
import { User } from "../user/user.model";
import { NotificationService } from "../notification/notification.service";

const createEvent = async (adminId: number, payload: Partial<IEvent>) => {
  return Event.create({ ...payload, adminId, status: EventStatus.PENDING } as IEvent);
};

const getAllEvents = async (query: { category?: string; status?: string; upcoming?: string }) => {
  const where: any = {};
  if (query.category) where.category = query.category;
  // Public users only see APPROVED events
  where.status = query.status || EventStatus.APPROVED;
  if (query.upcoming === "true") where.eventDate = { [Op.gte]: new Date() };

  return Event.findAll({
    where,
    order: [["eventDate", "ASC"]],
    include: [{ model: User, as: "admin", attributes: ["id", "name"] }],
  });
};

const getEventById = async (id: number) => {
  const event = await Event.findByPk(id, {
    include: [{ model: User, as: "admin", attributes: ["id", "name"] }],
  });
  if (!event) throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  return event;
};

const approveEvent = async (adminId: number, eventId: number) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  await event.update({ status: EventStatus.APPROVED });
  // Notify all users about new approved event
  // (In production, notify all — here notify the admin for demo)
  await NotificationService.createNotification({
    userId: adminId,
    type: "GENERAL",
    message: `Event "${event.title}" has been approved and is now live.`,
    refId: String(eventId),
  });
  return event;
};

const deleteEvent = async (adminId: number, eventId: number) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  await event.destroy();
};

// EventRegistration
const registerForEvent = async (userId: number, eventId: number) => {
  const event = await Event.findByPk(eventId);
  if (!event || event.status !== EventStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event not available for registration");
  }
  const existing = await EventRegistration.findOne({ where: { userId, eventId } });
  if (existing) throw new AppError(httpStatus.CONFLICT, "You have already registered for this event");
  return EventRegistration.create({ userId, eventId });
};

const getEventRegistrations = async (eventId: number) => {
  return EventRegistration.findAll({
    where: { eventId },
    include: [{ model: User, as: "user", attributes: ["id", "name", "email", "universityId"] }],
  });
};

const unregisterFromEvent = async (userId: number, eventId: number) => {
  const reg = await EventRegistration.findOne({ where: { userId, eventId } });
  if (!reg) throw new AppError(httpStatus.NOT_FOUND, "Registration not found");
  await reg.destroy();
};

export const EventService = {
  createEvent,
  getAllEvents,
  getEventById,
  approveEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  unregisterFromEvent,
};
