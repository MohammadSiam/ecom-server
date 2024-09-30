// userInfo.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserInfoDocument = UserInfo & Document;

@Schema({
  timestamps: { createdAt: 'dteCreatedAt', updatedAt: 'dteLastLoginAt' },
})
export class UserInfo {
  @Prop({ required: true })
  strUserName: string;

  @Prop({ required: true })
  strFirstName: string;

  @Prop({ required: true })
  strLastName: string;

  @Prop({ required: true })
  strEmail: string;

  @Prop({ required: true })
  strPassword: string;

  @Prop({ required: true })
  strPhone: string;

  @Prop({ default: '' })
  strImageURL: string;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
