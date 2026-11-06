import type { Listing, ListingFilters, SortKey } from "../types/listing";

const BASE_URL = "http://localhost:4000";
export const PAGE_SIZE = 10;

const SORT_PARAMS: Record<SortKey, { _sort: string; _order: "asc" | "desc" }> =
  {
    latest: { _sort: "createdAt", _order: "desc" },
    rentAsc: { _sort: "monthlyRent", _order: "asc" },
    areaDesc: { _sort: "area", _order: "desc" },
  };

// 목록 조회
export const fetchListings = async (
  params: ListingFilters & { page: number },
): Promise<{ items: Listing[]; total: number }> => {
  const query = new URLSearchParams();

  query.set("_page", String(params.page));
  query.set("_limit", String(PAGE_SIZE));

  if (params.q) query.set("q", params.q);
  if (params.type) query.set("type", params.type);
  if (params.region) query.set("region", params.region);
  if (params.minRent) query.set("monthlyRent_gte", params.minRent);
  if (params.maxRent) query.set("monthlyRent_lte", params.maxRent);

  const { _sort, _order } = SORT_PARAMS[params.sort];
  if (_sort) query.set("_sort", _sort);
  if (_order) query.set("_order", _order);

  const res = await fetch(BASE_URL + `/listings?${query}`);

  if (!res.ok) {
    throw new Error(`매물 목록 조회 실패 (${res.status})`);
  }

  const items = await res.json();
  const total = Number(res.headers.get("X-Total-Count"));

  return { items, total };
};

// 상세 조회
export const fetchListing = async (id: string): Promise<Listing> => {
  const url = BASE_URL + `/listings/${id}`;

  const res = await fetch(url);

  if (res.status === 404) {
    throw new Error(`매물을 찾을수 없습니다. (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(`매물 상세 조회 실패 (${res.status})`);
  }

  const item = await res.json();

  return item;
};
