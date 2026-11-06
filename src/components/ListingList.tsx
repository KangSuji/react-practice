import type { ListingsResponse } from "../types/listing";
import { ListingCard } from "./ListingCard";

type ListingListProps = {
  data: ListingsResponse | undefined;
  isPending: boolean;
  isError: boolean;
};

export const ListingList = ({ data, isPending, isError }: ListingListProps) => {
  if (isError) return <h4>에러 발생</h4>;

  if (!data || isPending) return;
  if (isPending) return <h1>로딩중 ...</h1>;
  if (data.items.length < 1) return <h4>데이터 없음</h4>;

  return (
    <div>
      {data.items.map((item) => {
        return <ListingCard key={item.id} listing={item} />;
      })}
    </div>
  );
};
