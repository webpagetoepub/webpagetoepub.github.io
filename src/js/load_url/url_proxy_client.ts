import DirectClient from './direct_client';

export default class URLProxyClient extends DirectClient {
  proxyURL: string;

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
