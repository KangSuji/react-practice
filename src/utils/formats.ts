export const formatPrice = (price: number): string => {
  let result = "";

  if (price < 10000) result = price.toLocaleString();
  if (price >= 10000) {
    const remain = (price % 10000).toLocaleString();
    result =
      Math.floor(price / 10000) + "억" + (remain === "0" ? "" : ` ${remain}`);
  }

  return result;
};
