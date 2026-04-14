import Client from './client';
import fetchWithTimeout from './fetch_with_timeout';

export default class DirectClient implements Client {
  requestTextContent(url: string) {
    return DirectClient.requestUrl(url).then(response => response.text());
  }

  loadFileFrom(url: string) {
    return DirectClient.requestUrl(url).then(response => response.blob());
  }

  static requestUrl(url: string) {
    return fetchWithTimeout(url);
  }
}
