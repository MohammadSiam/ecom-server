export interface IProduct {
  strCategory: string;
  strUuid: string;
  strProductName: string;
  strSlug: string;
  strDescription: string | null;
  strPackSize: string;
  decMrpPrice: string;
  strThumbnailUrl: string;
  dteCreatedAt: Date;
  dteUpdatedAt: Date;
  isActive: boolean;
}
