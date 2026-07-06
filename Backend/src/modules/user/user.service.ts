import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

const getMe = async (userId: number) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  return user;
};

export const UserServices = { getMe };
