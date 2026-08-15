// src/services/portalService.js
//
// Small helpers around the fixed portal config. Keeps the "is this
// navigation allowed?" domain check in one place so PortalWebViewScreen
// stays focused on UI.

/**
 * Checks whether a URL's hostname matches (or is a subdomain of) one of
 * a portal's allowedDomains. Used to keep the WebView scoped to the
 * school portal instead of becoming a general-purpose browser.
 */
export function isUrlAllowed(url, allowedDomains) {
  if (!allowedDomains || allowedDomains.length === 0) return true;
  try {
    const hostname = new URL(url).hostname;
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    // Malformed URL (e.g. "about:blank", "mailto:...") — let the WebView
    // handle it natively rather than blocking it outright.
    return true;
  }
}