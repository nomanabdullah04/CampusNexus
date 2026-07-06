export interface ICart {
  id?: number;
  userId: number;
  itemId: number;
  startDate?: Date;
  endDate?: Date;
  quantity: number;
}
