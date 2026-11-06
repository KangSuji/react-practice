import { ListingCard } from "../components/ListingCard";
import { useListings } from "../hooks/useListings";

export function ListPage() {
  const { data, isPending, isError } = useListings({ page: 1 });

  if (isPending) return <h1>로딩중 ...</h1>;
  if (isError) return <h4>에러 발생</h4>;
  if (data.items.length < 1) return <h4>데이터 없음</h4>;

  return (
    <div>
      {data.items.map((item) => {
        return <ListingCard key={item.id} listing={item} />;
      })}

      <p>총 {data.total}</p>
    </div>
  );
}
