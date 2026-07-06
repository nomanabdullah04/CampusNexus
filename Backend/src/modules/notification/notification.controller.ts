import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const notifications = await NotificationService.getUserNotifications(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Notifications retrieved", data: notifications });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = Number(req.user.userId);
  const notif = await NotificationService.markAsRead(id, userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Notification marked as read", data: notif });
});

const markAllRead = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  await NotificationService.markAllAsRead(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "All notifications marked as read", data: null });
});

export const NotificationController = { getNotifications, markAsRead, markAllRead };
