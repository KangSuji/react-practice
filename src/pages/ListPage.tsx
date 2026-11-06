import { useState } from "react";
import { useListings } from "../hooks/useListings";
import { FilterBar } from "../components/FilterBar";
import type { ListingFilters } from "../types/listing";
import { ListingList } from "../components/ListingList";
import { useDebounce } from "../hooks/useDebounce";

const INITIAL_FILTERS: ListingFilters = {
  q: "",
  type: "",
  region: "",
  minRent: "",
  maxRent: "",
  sort: "latest",
};

export function ListPage() {
  const [filters, setFilters] = useState<ListingFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedQ = useDebounce(filters.q, 300);
  const { data, isPending, isError } = useListings({
    ...filters,
    q: debouncedQ,
    page,
  });

  const handleFilterChange = (next: ListingFilters) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div>
      <FilterBar filters={filters} onChange={handleFilterChange} />
      <ListingList data={data} isPending={isPending} isError={isError} />
      <p>총 {data?.total}</p>
    </div>
  );
}
