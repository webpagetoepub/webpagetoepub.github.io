import Client from './client';
import fetchWithTimeout from './fetch_with_timeout';
import CantLoadFileError from './cantloadfileerror';
import decodeResponseText from './decode_text';

// `/get` returns the page inside a JSON document, already decoded as UTF-8 on
// the proxy side; pages in any other encoding arrive as mojibake that can't be
// recovered. `/raw` forwards the original bytes (and Content-Type header), so
// the encoding can be detected here, like for a direct download.
const PROXY_CORS = 'https://api.allorigins.win/get?url=';
const PROXY_CORS_RAW = 'https://api.allorigins.win/raw?url=';

interface AllOriginsResponse {
  contents: string;
  status: {
    url: string;
    content_type: string;
    http_code: number;
    response_time: number;
    content_length: number;
  };
}

class AllOriginsClient implements Client {
  requestTextContent(url: string) {
    const newUrl = PROXY_CORS_RAW + encodeURIComponent(url);

    return fetchWithTimeout(newUrl).then(decodeResponseText);
  }

  loadFileFrom(url: string) {
    return AllOriginsClient.requestUrl(url).then(response => response.contents).then(dataUrl => {
      return fetch(dataUrl).then(response => response.blob());
    });
  }

  static requestUrl(url: string) {
    const newUrl = PROXY_CORS + encodeURIComponent(url);

    return fetchWithTimeout(newUrl).then(response => response.json()).then((json: AllOriginsResponse) => {
      const http_code = json.status.http_code;
      if ((http_code < 200) || (http_code > 299)) {
        throw new CantLoadFileError(url);
      }

      return json;
    });
  }
}

export default new AllOriginsClient();
