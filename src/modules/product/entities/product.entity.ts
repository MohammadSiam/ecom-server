import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {
  @Prop({ required: true })
  strCategory: string;

  @Prop({ required: true })
  strUuid: string;

  @Prop({ required: true })
  strProductName: string;

  @Prop({ required: true })
  strSlug: string;

  @Prop({ default: null })
  strDescription: string;

  @Prop({ required: true })
  strPackSize: string;

  @Prop({ required: true })
  decMrpPrice: string;

  @Prop({ required: true })
  strThumbnailUrl: string;

  @Prop({ required: true })
  dteCreatedAt: Date;

  @Prop({ required: true })
  dteUpdatedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
