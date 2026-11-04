export interface ApprovedAffiliateProduct {
  id: string;
  name: string;
  category: string;
  url: string;
  merchant: string;
  affiliate: boolean;
}

// Populate only after merchant approval and verification of the destination URL and tracking.
export const APPROVED_AFFILIATE_PRODUCTS: readonly ApprovedAffiliateProduct[] =
  [];

export const AFFILIATE_DISCLOSURE =
  "Some links may be affiliate links. QuoteXbert may earn a commission if you purchase through them, at no additional cost to you.";

export function getApprovedAffiliateProducts(ids: string[]) {
  const requested = new Set(ids);
  return APPROVED_AFFILIATE_PRODUCTS.filter((product) =>
    requested.has(product.id),
  );
}
