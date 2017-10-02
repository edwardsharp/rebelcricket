export class VendorGood {
  _id: string;
  category: string;
  sub_category: string;
  title: string;
  prod_id: string;
  price: number;
  colors_count: number;
  prod_desc_text: string;
  prod_desc_items: Array<string>;
  href_items: Array<string>;
  colors: Array<{name: string, href: string}>;
  color_size_prices: Array<{color: string, size_prices: Array<[string,string]>}>;
}
