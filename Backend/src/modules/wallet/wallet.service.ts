import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { TransactionType, TransactionStatus } from "../transaction/transaction.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

const deposit = async (userId: number, amount: number, method: string) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  const wallet = await Wallet.findOne({ where: { ownerId: userId } });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // Update balance
  await wallet.update({ balance: Number(wallet.balance) + amount });

  // Create transaction log
  const transaction = await Transaction.create({
    userId,
    amount,
    type: TransactionType.DEPOSIT,
    status: TransactionStatus.COMPLETED,
    description: `Deposited via ${method}`,
  } as any);

  return { wallet, transaction };
};

export const WalletService = { deposit };
