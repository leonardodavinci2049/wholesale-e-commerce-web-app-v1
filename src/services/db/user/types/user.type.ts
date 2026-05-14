import type { RowDataPacket } from "mysql2";

// Login feedback information

export interface SpDefaultFeedback extends RowDataPacket {
  sp_return_id: string;
  sp_message: string;
  sp_error_id: number;
}

// Database operation result
export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

export interface TblUserFindById extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  emailVerified: number;
  image: string;
  twoFactorEnabled: number;
  role: string;
  banned: number;
  banReason: string;
  banExpires: Date;
  organizations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TblUserFindAll extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  organizations: string[];
  createdAt: Date;
}

export type SpResultRecordCreateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordUpdateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordDeleteType = [SpDefaultFeedback[], SpOperationResult];

// Or keep the tuple type and create a related interface
export type SpResultRecordFindByIdType = [
  TblUserFindById[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];

export type SpResultRecordFindType = [
  TblUserFindAll[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];
