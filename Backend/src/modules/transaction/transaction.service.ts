import { Transaction } from "./transaction.model";
import { TransactionType, TransactionStatus } from "./transaction.interface";

const createTransaction = async (data: {
  userId: number;
  rentalId?: number;
  type: TransactionType;
  amount: number;
  description?: string;
}) => {
  return Transaction.create({
    ...data,
    status: TransactionStatus.COMPLETED,
  });
};

const getUserTransactions = async (userId: number) => {
  return Transaction.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
};

export const TransactionService = { createTransaction, getUserTransactions };
