import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IEvent, IEventRegistration, EventCategory, EventStatus } from "./event.interface";

// ── Event Model ──────────────────────────────────────────────────────────────
interface EventCreationAttributes extends Optional<IEvent, "id"> {}

export class Event extends Model<IEvent, EventCreationAttributes> implements IEvent {
  public id!: number;
  public adminId!: number;
  public title!: string;
  public description!: string;
  public category!: EventCategory;
  public eventDate!: Date;
  public location!: string;
  public image!: string;
  public status!: EventStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    adminId: { type: DataTypes.INTEGER, allowNull: false, field: "admin_id" },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.ENUM(...Object.values(EventCategory)), allowNull: false },
    eventDate: { type: DataTypes.DATE, allowNull: false, field: "event_date" },
    location: { type: DataTypes.STRING(255) },
    image: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM(...Object.values(EventStatus)),
      defaultValue: EventStatus.PENDING,
    },
  },
  { sequelize, tableName: "event", timestamps: true }
);

// ── EventRegistration Model ───────────────────────────────────────────────────
interface EventRegCreationAttributes extends Optional<IEventRegistration, "id"> {}

export class EventRegistration extends Model<IEventRegistration, EventRegCreationAttributes> implements IEventRegistration {
  public id!: number;
  public eventId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
}

EventRegistration.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    eventId: { type: DataTypes.INTEGER, allowNull: false, field: "event_id" },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
  },
  { sequelize, tableName: "event_registration", timestamps: true, updatedAt: false }
);
