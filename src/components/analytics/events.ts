/**
 * Google Analytics 4 E-commerce Events
 *
 * Utility functions to track e-commerce events following GA4 specifications.
 * These events enable enhanced e-commerce reports in Google Analytics.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "js",
      action: string,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Product item for GA4 e-commerce events
 */
export interface GA4Item {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  price: number;
  quantity?: number;
  discount?: number;
}

/**
 * Check if gtag is available
 */
function isGtagAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Track view_item event when user views a product detail page
 *
 * @param item - Product details
 * @param currency - Currency code (default: BRL)
 */
export function trackViewItem(item: GA4Item, currency = "BRL"): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "view_item", {
    currency,
    value: item.price,
    items: [item],
  });
}

/**
 * Track add_to_cart event when user adds a product to cart
 *
 * @param item - Product details with quantity
 * @param currency - Currency code (default: BRL)
 */
export function trackAddToCart(item: GA4Item, currency = "BRL"): void {
  if (!isGtagAvailable()) return;

  const value = item.price * (item.quantity || 1);

  window.gtag("event", "add_to_cart", {
    currency,
    value,
    items: [item],
  });
}

/**
 * Track remove_from_cart event when user removes a product from cart
 *
 * @param item - Product details with quantity
 * @param currency - Currency code (default: BRL)
 */
export function trackRemoveFromCart(item: GA4Item, currency = "BRL"): void {
  if (!isGtagAvailable()) return;

  const value = item.price * (item.quantity || 1);

  window.gtag("event", "remove_from_cart", {
    currency,
    value,
    items: [item],
  });
}

/**
 * Track view_cart event when user views the cart
 *
 * @param items - Array of products in cart
 * @param value - Total cart value
 * @param currency - Currency code (default: BRL)
 */
export function trackViewCart(
  items: GA4Item[],
  value: number,
  currency = "BRL",
): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "view_cart", {
    currency,
    value,
    items,
  });
}

/**
 * Track begin_checkout event when user starts checkout process
 *
 * @param items - Array of products in cart
 * @param value - Total cart value
 * @param currency - Currency code (default: BRL)
 */
export function trackBeginCheckout(
  items: GA4Item[],
  value: number,
  currency = "BRL",
): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "begin_checkout", {
    currency,
    value,
    items,
  });
}

/**
 * Track purchase event when user completes a purchase
 *
 * @param transactionId - Unique transaction ID
 * @param items - Array of purchased products
 * @param value - Total transaction value
 * @param shipping - Shipping cost
 * @param tax - Tax amount
 * @param currency - Currency code (default: BRL)
 */
export function trackPurchase(
  transactionId: string,
  items: GA4Item[],
  value: number,
  shipping = 0,
  tax = 0,
  currency = "BRL",
): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "purchase", {
    transaction_id: transactionId,
    currency,
    value,
    shipping,
    tax,
    items,
  });
}

/**
 * Track view_item_list event when user views a product list (category, search results)
 *
 * @param listId - Unique list identifier (e.g., category slug)
 * @param listName - Human-readable list name
 * @param items - Array of products in the list
 */
export function trackViewItemList(
  listId: string,
  listName: string,
  items: GA4Item[],
): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "view_item_list", {
    item_list_id: listId,
    item_list_name: listName,
    items,
  });
}

/**
 * Track select_item event when user clicks on a product in a list
 *
 * @param listId - Unique list identifier
 * @param listName - Human-readable list name
 * @param item - Selected product
 */
export function trackSelectItem(
  listId: string,
  listName: string,
  item: GA4Item,
): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "select_item", {
    item_list_id: listId,
    item_list_name: listName,
    items: [item],
  });
}

/**
 * Track search event when user performs a search
 *
 * @param searchTerm - Search query entered by user
 */
export function trackSearch(searchTerm: string): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", "search", {
    search_term: searchTerm,
  });
}

/**
 * Track custom event
 *
 * @param eventName - Custom event name
 * @param params - Event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", eventName, params);
}
