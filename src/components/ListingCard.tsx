//제목, 유형, 지역(구와 동), 보증금 1억 2,000 / 월 350, 면적(㎡), 상태

import { Link } from "react-router-dom";
import type { Listing, ListingType } from "../types/listing";
import { formatPrice } from "../utils/formats";
import styles from "./ListingCard.module.css";

export const TYPE_CLASS: Record<ListingType, string> = {
  상가: "store",
  사무실: "office",
  건물: "building",
};

// 사용 가능, 계약됨
export function ListingCard({ listing }: { listing: Listing }) {
  const type = TYPE_CLASS[listing.type];

  return (
    <Link to={`/listings/${listing.id}`}>
      <div className={`${styles.list_card} ${styles[listing.status]}`}>
        <div className={styles.title_area}>
          <p className={styles.title}>{listing.title}</p>
          <span className={`${styles.badge} ${styles[type]}`}>
            {listing.type}
          </span>
          <span className={`${styles.badge} ${styles[listing.status]}`}>
            {listing.status === "available" ? "계약가능" : "계약완료"}
          </span>
        </div>
        <p>
          {listing.region} {listing.dong} {listing.floor}
        </p>
        <p>{`보증금 ${formatPrice(listing.deposit)} / 월 ${formatPrice(listing.monthlyRent)}`}</p>
        <p>{listing.area}㎡</p>
      </div>
    </Link>
  );
}
