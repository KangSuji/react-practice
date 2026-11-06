import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchListings } from "../api/listings";
import type { ListingFilters } from "../types/listing";

export function useListings(params: ListingFilters & { page: number }) {
  return useQuery({
    queryKey: ["listings", params],
    placeholderData: keepPreviousData,
    queryFn: () => fetchListings(params),
  });
}
