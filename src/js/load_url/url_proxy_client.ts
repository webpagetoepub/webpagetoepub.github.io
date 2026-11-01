import DirectClient from "./direct_client";

export default class URLProxyClient extends DirectClient {
  proxyURL: string;

  // The proxy rewrites the Content-Type header (and may alter the BOM), so its
  // transport-level encoding signals can't be trusted; decode from the
  // in-document declaration and the bytes instead.
  protected trustTransport = false;

  constructor(proxyURL: string) {
    super();

    this.proxyURL = proxyURL;
  }

  requestTextContent(url: string) {
    return super.requestTextContent(this.generateProxyUrl(url));
  }

  loadFileFrom(url: string) {
    return super.loadFileFrom(this.generateProxyUrl(url));
  }

  generateProxyUrl(url: string) {
    return this.proxyURL + encodeURIComponent(url);
  }
}
