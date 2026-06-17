const toGs = (n) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const formatGs = (price) =>
  `Gs. ${toGs(Number(price))}`;

export const formatGsDiscount = (price, discount) =>
  formatGs(Number(price) - (Number(price) * Number(discount)) / 100);
