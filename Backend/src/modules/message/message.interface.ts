export interface IMessage {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
