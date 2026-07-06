import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { INotification } from "./notification.interface";

interface NotificationCreationAttributes extends Optional<INotification, "id"> {}

export class Notification extends Model<INotification, NotificationCreationAttributes> implements INotification {
  public id!: number;
  public userId!: number;
  public type!: INotification["type"];
  public message!: string;
  public refId!: string;
  public isRead!: boolean;
  public readonly createdAt!: Date;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    type: {
      type: DataTypes.ENUM("RENTAL_REQUEST", "RENTAL_UPDATE", "REVIEW_RECEIVED", "GENERAL"),
      allowNull: false,
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    refId: { type: DataTypes.STRING(100), field: "ref_id" },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_read" },
  },
  {
    sequelize,
    tableName: "notification",
    timestamps: true,
    updatedAt: false,
  }
);
