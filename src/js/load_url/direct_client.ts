import Client from "./client";
import fetchWithTimeout from "./fetch_with_timeout";
import decodeResponseText from "./decode_text";

export default class DirectClient implements Client {
  // A direct response carries the server's own headers and bytes, so its
  // Content-Type charset and BOM can be trusted. A proxy that rewrites the
  // response turns this off (see URLProxyClient).
  protected trustTransport = true;

  requestTextContent(url: string) {
    return DirectClient.requestUrl(url).then((response) =>
      decodeResponseText(response, this.trustTransport),
    );
  }

  loadFileFrom(url: string) {
    return DirectClient.requestUrl(url).then((response) => response.blob());
  }

  static requestUrl(url: string) {
    return fetchWithTimeout(url);
  }
}
