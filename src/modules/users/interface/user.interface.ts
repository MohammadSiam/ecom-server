import { Document } from 'mongoose';

export interface IUserInfo extends Document {
  intRoleId: number;
  strUserName?: string;
  strFirstName?: string;
  strLastName?: string;
  strEmail: string;
  strPassword: string;
  strPhone: string;
  strImageURL?: string;
  dteCreatedAt?: Date;
  dteLastLoginAt?: Date;
}
