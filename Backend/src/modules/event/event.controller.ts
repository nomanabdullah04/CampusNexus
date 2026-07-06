import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { EventService } from "./event.service";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const adminId = Number(req.user.userId);
  const data = await EventService.createEvent(adminId, req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Event created (pending approval)", data });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const data = await EventService.getAllEvents(req.query as any);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Events retrieved", data });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
  const data = await EventService.getEventById(Number(req.params.id));
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Event retrieved", data });
});

const approveEvent = catchAsync(async (req: Request, res: Response) => {
  const adminId = Number(req.user.userId);
  const data = await EventService.approveEvent(adminId, Number(req.params.id));
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Event approved", data });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const adminId = Number(req.user.userId);
  await EventService.deleteEvent(adminId, Number(req.params.id));
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Event deleted", data: null });
});

const registerForEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await EventService.registerForEvent(userId, Number(req.params.id));
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Registered for event", data });
});

const getEventRegistrations = catchAsync(async (req: Request, res: Response) => {
  const data = await EventService.getEventRegistrations(Number(req.params.id));
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Registrations retrieved", data });
});

const unregisterFromEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  await EventService.unregisterFromEvent(userId, Number(req.params.id));
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Unregistered from event", data: null });
});

export const EventController = {
  createEvent, getAllEvents, getEventById,
  approveEvent, deleteEvent,
  registerForEvent, getEventRegistrations, unregisterFromEvent,
};
