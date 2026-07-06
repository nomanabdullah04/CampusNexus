import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionService } from "./transaction.service";

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await TransactionService.getUserTransactions(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Transactions retrieved", data });
});

export const TransactionController = { getMyTransactions };
