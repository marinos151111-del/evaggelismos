export interface StoreInfo {
  city: string;
  address: string;
  region: string;
  tel: string;
  telDisplay: string;
  img: string;
  flagship?: boolean;
}

export const STORES: StoreInfo[] = [
  {
    city: 'Nicosia',
    address: '65 Kennedy Avenue',
    region: 'Nicosia 1076, Cyprus',
    tel: '+35722672525',
    telDisplay: '+357 22 672525',
    img: 'assets/store-nicosia.jpg',
    flagship: true,
  },
  {
    city: 'Larnaca',
    address: '19A Giannou Kranidioti',
    region: 'Larnaca, Cyprus',
    tel: '+35724665486',
    telDisplay: '+357 24 665486',
    img: 'assets/store-larnaca.jpg',
  },
  {
    city: 'Limassol',
    address: '43 Nikou Pattichi',
    region: 'Limassol, Cyprus',
    tel: '+35725737322',
    telDisplay: '+357 25 737322',
    img: 'assets/store-limassol.jpg',
  },
];

export const CONTACT_EMAIL = 'info@evangelismosmusic.com';

export function mapsUrl(store: StoreInfo): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Evangelismos Music Stores, ${store.address}, ${store.region}`
  )}`;
}
