import URLProxyClient from "./url_proxy_client";

// Path-style proxy: the target URL is appended to the proxy URL unencoded
// (e.g. http://localhost:8081/https://example.com/page), as expected by
// cors-anywhere. This differs from URLProxyClient, which percent-encodes the
// target for a `?url=` query-string proxy.
export default class PathProxyClient extends URLProxyClient {
  generateProxyUrl(url: string) {
    return this.proxyURL + url;
  }
}
