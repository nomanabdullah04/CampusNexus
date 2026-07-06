import AppError from "../../errorHelpers/AppError";
import { IUser, Role, Status } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { extractUniversityId } from "../../utils/userIdExtract";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, activeRole, ...rest } = payload;

  if (activeRole && ![Role.BUYER, Role.SELLER].includes(activeRole)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid role! You can only register as Buyer or Seller"
    );
  }

  const isUserExists = await User.findOne({ where: { email } });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // Validate CoU email and extract student ID (throws if not @cou.ac.bd)
  const universityId = extractUniversityId(email as string);

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email: email as string,
    activeRole: activeRole || Role.BUYER,
    password: hashedPassword,
    universityId,
    isStatus: Status.ACTIVE,  // auto-activate for convenience
    ...rest,
  } as IUser);

  // Create wallet with 100 starting balance
  await Wallet.create({
    ownerId: user.id!,
    balance: 100,
    status: WalletStatus.ACTIVE,
  });

  const finalUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password"] },
  });

  return finalUser;
};

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ where: { email } });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExists.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  const userToken = createUserToken(isUserExists.toJSON());

  const { password: _pass, ...userWithoutPassword } = isUserExists.toJSON() as any;

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: userWithoutPassword,
  };
};

const resetPassword = async (payload: { email: string; newPassword: string }) => {
  const { email, newPassword } = payload;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No account found with this email address.");
  }

  if (newPassword.length < 6) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password must be at least 6 characters.");
  }

  const hashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
  await user.update({ password: hashedPassword });

  return { message: "Password reset successfully." };
};

const checkEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No account found with this email address.");
  }
  return { exists: true };
};

export const AuthServices = {
  createUser,
  credentialLogin,
  resetPassword,
  checkEmail,
};
