import { Message } from "./message.model";
import { User } from "../user/user.model";
import { Op } from "sequelize";

const sendMessage = async (senderId: number, receiverId: number, content: string) => {
  return Message.create({ senderId, receiverId, content });
};

const getThread = async (userId1: number, userId2: number) => {
  return Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    order: [["createdAt", "ASC"]],
  });
};

const getContacts = async (userId: number) => {
  const messages = await Message.findAll({
    where: {
      [Op.or]: [{ senderId: userId }, { receiverId: userId }],
    },
    order: [["createdAt", "DESC"]],
  });

  const contactIds = new Set<number>();
  messages.forEach((m) => {
    if (m.senderId !== userId) contactIds.add(m.senderId);
    if (m.receiverId !== userId) contactIds.add(m.receiverId);
  });

  if (contactIds.size === 0) return [];

  const contacts = await User.findAll({
    where: { id: Array.from(contactIds) },
    attributes: ["id", "name", "email", "picture"],
  });

  return contacts;
};

export const MessageService = { sendMessage, getThread, getContacts };
