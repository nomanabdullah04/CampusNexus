export enum RefundStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IRefund {
  id?: number;
  rentalId: number;
  requesterId: number;
  reason: string;
  proof?: string;
  status: RefundStatus;
  adminNote?: string;
}
