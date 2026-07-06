export enum RentalStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  RETURNED = "RETURNED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  OVERDUE = "OVERDUE",       // Proposal: item not returned on time
}

export interface IRental {
  id?: number;
  _id?: number;
  itemId: number;
  renterId: number;
  ownerId: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  depositPaid?: number;       // Proposal: deposit_paid field
  status: RentalStatus;
  message?: string;
}
