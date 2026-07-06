export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  id?: number;
  ownerId: number;
  balance: number;
  status?: WalletStatus;
}