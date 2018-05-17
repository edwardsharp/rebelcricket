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

  key?: string;
  catalog?: string;
  brand?: string;
}

export class VendorGoodStyle {
  company: string;
  styleCode: string;
  description: string;
  features: string;
  domain: string;
  prodDetailImage: string;
  prodThumbnailImage: string;
  prodCompareImage: string;
  prodSearchImage: string;
  millCategory: string;
  millCode: string;
  categoryCode: string;
  itemCount: string;
  millName: string;
  categoryName: string;
  popularity: string;
}

export class VendorGoodItem {
  company: string;
  itemNumber: string;
  description: string;
  features: string;
  piece: string;
  dozen: string;
  case: string;
  styleCode: string;
  sizeName: string;
  sizeCategory: string;
  sizeCode: string;
  colorName: string;
  hexCode: string;
  colorCode: string;
  weight: string;
  domain: string;
  prodDetailImage: string;
  prodGalleryImage: string;
  retailPrice: string;
  styleNumber: string;
  gTINNumber: string;
  maxInventory: string;
  closeout: string;
  millName: string;
  packQty: string;
  caseQty: string;
  launchDate: string;
  comingSoon: string;
  frontofImageName: string;
  backofImageName: string;
  sideofImageName: string;
  pMSCode: string;
  sizeSortOrder: string;
}
