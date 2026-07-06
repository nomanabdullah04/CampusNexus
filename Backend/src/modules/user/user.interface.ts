export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  BUYER = "BUYER",
}

export enum Status {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPEND = "SUSPEND",
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  universityId?: string;
  phone?: string;
  presentAddress?: string;
  picture?: string;
  activeRole?: Role;
  isVerified?: boolean;
  isStatus?: Status;
}
