import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginInfoDocument = LoginInfo & Document;

@Schema({
  timestamps: { createdAt: 'dteCreatedAt', updatedAt: 'dteLastLoginAt' },
})
export class LoginInfo {
  @Prop({ required: false })
  strUserId: string;

  @Prop({ required: true })
  strEmail: string;

  @Prop({ required: true })
  strPhone: string;

  @Prop({ required: true })
  strPassword: string;

  @Prop({ nullable: true })
  intOtp: number;

  @Prop({ nullable: true })
  strAccess_token: string;

  @Prop({ nullable: true })
  strRefresh_token: string;

  @Prop({ default: Date.now })
  dteLastLogin: Date;
}

export const LoginInfoSchema = SchemaFactory.createForClass(LoginInfo);
