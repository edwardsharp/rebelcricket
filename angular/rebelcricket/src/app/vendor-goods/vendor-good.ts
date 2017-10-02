export class VendorGood {
  selected: boolean;
  price: number;
  title: string;
  category: string;
  sub_category: string;
  images: Array<string>;
  colors: Array<{name: string, href: string}>;
  color_sizes_prices: Array<{color: string, sizes: Array<string>, prices: Array<string>}>;
}
