import type { ListingFilters, SortKey } from "../types/listing";

type FilterBarProps = {
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
};

const REGIONS = ["강남구", "성동구", "마포구", "송파구", "영등포구"];

export const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  return (
    <div>
      <label htmlFor="q">검색</label>
      <input
        id="q"
        type="search"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />

      <label htmlFor="type">유형</label>
      <select
        id="type"
        value={filters.type}
        onChange={(e) =>
          onChange({
            ...filters,
            type: e.target.value as ListingFilters["type"],
          })
        }
      >
        <option value="">전체</option>
        <option value="상가">상가</option>
        <option value="사무실">사무실</option>
        <option value="건물">건물</option>
      </select>

      <label htmlFor="region">지역</label>
      <select
        id="region"
        value={filters.region}
        onChange={(e) => onChange({ ...filters, region: e.target.value })}
      >
        <option value="">전체</option>
        {REGIONS.map((region) => {
          return (
            <option key={region} value={region}>
              {region}
            </option>
          );
        })}
      </select>

      <label htmlFor="minRent">최소 월세</label>
      <input
        id="minRent"
        type="number"
        value={filters.minRent}
        onChange={(e) => onChange({ ...filters, minRent: e.target.value })}
      />

      <label htmlFor="maxRent">최대 월세</label>
      <input
        id="maxRent"
        type="number"
        value={filters.maxRent}
        onChange={(e) => onChange({ ...filters, maxRent: e.target.value })}
      />

      <label htmlFor="sort">정렬</label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(e) =>
          onChange({ ...filters, sort: e.target.value as SortKey })
        }
      >
        <option value="latest">최신순</option>
        <option value="rentAsc">월세 낮은순</option>
        <option value="areaDesc">면적 넓은순</option>
      </select>
    </div>
  );
};
