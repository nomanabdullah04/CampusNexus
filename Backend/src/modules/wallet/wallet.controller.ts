import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from "./wallet.service";

const deposit = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const { amount, method } = req.body;
  const result = await WalletService.deposit(userId, Number(amount), method);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposit successful",
    data: result,
  });
});

export const WalletController = { deposit };
