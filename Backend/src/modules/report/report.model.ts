import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IReport, ReportReason, ReportStatus, ReportTargetType } from "./report.interface";

interface ReportCreationAttributes extends Optional<IReport, "id"> {}

export class Report extends Model<IReport, ReportCreationAttributes> implements IReport {
  public id!: number;
  public reporterId!: number;
  public targetType!: ReportTargetType;
  public targetId!: number;
  public reason!: ReportReason;
  public details!: string;
  public status!: ReportStatus;
  public adminNote!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Report.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    reporterId: { type: DataTypes.INTEGER, allowNull: false, field: "reporter_id" },
    targetType: { type: DataTypes.ENUM(...Object.values(ReportTargetType)), allowNull: false, field: "target_type" },
    targetId: { type: DataTypes.INTEGER, allowNull: false, field: "target_id" },
    reason: { type: DataTypes.ENUM(...Object.values(ReportReason)), allowNull: false },
    details: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM(...Object.values(ReportStatus)),
      defaultValue: ReportStatus.PENDING,
    },
    adminNote: { type: DataTypes.TEXT, field: "admin_note" },
  },
  { sequelize, tableName: "report", timestamps: true }
);
