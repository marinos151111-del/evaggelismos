export interface Product {
  id: number;
  name: string;
  price: number;
  old: number | null;
  offer: boolean;
  desc: string;
  cat: string;
  sub: string;
  /** relative path like "assets/products/<hash>.webp" — render as `/${img}` */
  img: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface CartItem {
  id: number;
  qty: number;
}
