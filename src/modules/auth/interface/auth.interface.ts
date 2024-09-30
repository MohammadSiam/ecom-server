import { Document } from 'mongoose';

export interface ILoginInfo extends Document {
  strUserId: string;
  strEmail: string;
  strPhone: string;
  strPassword: string;
  intOtp?: number;
  strAccess_token?: string;
  strRefresh_token?: string;
  dteLastLogin?: Date;
}

export interface IOrganizationRegister extends Document {
  strUserName?: string;
  strFirstName?: string;
  strLastName?: string;
  strEmail: string;
  strPassword: string;
  strPhone: string;
  strImageURL?: string;
  blnIsActive: boolean;
  dteCreatedAt?: Date;
  dteLastLoginAt?: Date;
}
