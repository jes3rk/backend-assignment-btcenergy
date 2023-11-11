import { ITransaction } from "./transaction.interface";

export interface IBlock {
  hash: string;
  version: number;
  prev_block: string;
  next_block: string[];
  time: number;
  bits: number;
  size: number;
  tx: ITransaction[];
}
