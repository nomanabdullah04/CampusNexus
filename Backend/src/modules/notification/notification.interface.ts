export type NotificationType = "RENTAL_REQUEST" | "RENTAL_UPDATE" | "REVIEW_RECEIVED" | "GENERAL";

export interface INotification {
  id?: number;
  userId: number;
  type: NotificationType;
  message: string;
  refId?: string;
  isRead: boolean;
}
