import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IMessage } from "./message.interface";

interface MessageCreationAttributes extends Optional<IMessage, "id"> {}

export class Message extends Model<IMessage, MessageCreationAttributes> implements IMessage {
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    senderId: { type: DataTypes.INTEGER, allowNull: false, field: "sender_id" },
    receiverId: { type: DataTypes.INTEGER, allowNull: false, field: "receiver_id" },
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, tableName: "message", timestamps: true }
);
