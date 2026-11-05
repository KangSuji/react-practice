import type { Listing } from "../types/listing";

const BASE_URL = "http://localhost:4000";
export const PAGE_SIZE = 10;

// 목록 조회
export const fetchListings = async (params: {
  page: number;
}): Promise<{ items: Listing[]; total: number }> => {
  const query = new URLSearchParams();

  query.set("_page", String(params.page));
  query.set("_limit", String(PAGE_SIZE));

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
