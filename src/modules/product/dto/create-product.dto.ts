export class CreateProductDto {
  readonly strCategory: string;
  readonly strUuid: string;
  readonly strProductName: string;
  readonly strSlug: string;
  readonly strDescription?: string | null; // Optional field
  readonly strPackSize: string;
  readonly decMrpPrice: string;
  readonly strThumbnailUrl: string;
  readonly dteCreatedAt: Date;
  readonly dteUpdatedAt: Date;
  readonly isActive: boolean;
}
