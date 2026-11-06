/** 매물 목록 종류 */
export type ListingType = "상가" | "사무실" | "건물";

/** 매물 목록 상태  */
export type ListingStatus = "available" | "contracted";
/**
 * 매물 목록 타입
 */
export interface Listing {
  id: number;
  title: string;
  type: ListingType;
  region: string;
  dong: string;
  deposit: number;
  monthlyRent: number;
  maintenanceFee: number;
  area: number;
  floor: string;
  tags: string[];
  status: ListingStatus;
  description: string;
  createdAt: string;
  views: number;
}

/**
 * 문의 타입
 */
export interface Inquiry {
  id: number;
  listingId: number;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

export type CreateInquiryInput = Omit<Inquiry, "id">;

export type SortKey = "latest" | "rentAsc" | "areaDesc";

export interface ListingFilters {
  q: string;
  type: ListingType | ""; // "" = 전체
  region: string;
  minRent: string;
  maxRent: string;
  sort: SortKey;
}

// types/listing.ts
export type ListingsResponse = { items: Listing[]; total: number };
