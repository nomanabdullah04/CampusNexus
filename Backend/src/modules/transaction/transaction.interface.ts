export enum TransactionType {
  PAYMENT = "PAYMENT",
  DEPOSIT = "DEPOSIT",
  REFUND = "REFUND",
  EARNING = "EARNING",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface ITransaction {
  id?: number;
  userId: number;
  rentalId?: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
}
