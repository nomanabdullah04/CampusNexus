export interface IReview {
  id?: number;
  itemId: number;
  rentalId: number;
  reviewerId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}
