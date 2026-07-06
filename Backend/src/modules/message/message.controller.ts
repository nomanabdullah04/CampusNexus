import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { MessageService } from "./message.service";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;
    const message = await MessageService.sendMessage(senderId, Number(receiverId), content);
    res.status(httpStatus.CREATED).json({ success: true, data: message });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

const getThread = async (req: Request, res: Response) => {
  try {
    const userId1 = req.user.userId;
    const { otherUserId } = req.query;
    const messages = await MessageService.getThread(userId1, Number(otherUserId));
    res.status(httpStatus.OK).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

const getContacts = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const contacts = await MessageService.getContacts(userId);
    res.status(httpStatus.OK).json({ success: true, data: contacts });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

export const MessageController = { sendMessage, getThread, getContacts };
