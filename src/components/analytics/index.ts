/**
 * Analytics Module
 *
 * Exports Google Analytics 4 component and e-commerce event tracking functions.
 */

export {
  type GA4Item,
  trackAddToCart,
  trackBeginCheckout,
  trackEvent,
  trackPurchase,
  trackRemoveFromCart,
  trackSearch,
  trackSelectItem,
  trackViewCart,
  trackViewItem,
  trackViewItemList,
} from "./events";
export { GoogleAnalytics } from "./GoogleAnalytics";
