export enum ReportReason {
  FRAUD = "FRAUD",
  INAPPROPRIATE = "INAPPROPRIATE",
  SPAM = "SPAM",
  WRONG_INFO = "WRONG_INFO",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export enum ReportTargetType {
  ITEM = "ITEM",
  USER = "USER",
}

export interface IReport {
  id?: number;
  reporterId: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  adminNote?: string;
}
