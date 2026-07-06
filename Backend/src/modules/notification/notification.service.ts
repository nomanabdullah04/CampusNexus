import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { INotification } from "./notification.interface";
import { Notification } from "./notification.model";

const createNotification = async (payload: {
  userId: number;
  type: INotification["type"];
  message: string;
  refId?: string;
}) => {
  return Notification.create({
    userId: payload.userId,
    type: payload.type,
    message: payload.message,
    refId: payload.refId,
    isRead: false,
  });
};

const getUserNotifications = async (userId: number) => {
  return Notification.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit: 50,
  });
};

const markAsRead = async (notificationId: number, userId: number) => {
  const notif = await Notification.findByPk(notificationId);
  if (!notif) throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
  if (notif.userId !== userId) throw new AppError(httpStatus.FORBIDDEN, "Not authorized");
  await notif.update({ isRead: true });
  return notif;
};

const markAllAsRead = async (userId: number) => {
  await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
