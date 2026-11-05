import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "../api/listings";

export function useListings(params: { page: number }) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => fetchListings(params),
  });
}
