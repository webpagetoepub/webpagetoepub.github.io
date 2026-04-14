import CantLoadFileError from './cantloadfileerror';

const DEFAULT_TIMEOUT = 10000;

export default function fetchWithTimeout(url: string): Promise<Response> {
  if (typeof AbortController === 'undefined') {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new CantLoadFileError(url);
      }

      return response;
    });
  }

  const abortController = new AbortController();
  const options = {method: 'GET', signal: abortController.signal};
  const timeout = setTimeout(() => abortController.abort(), DEFAULT_TIMEOUT);

  return fetch(url, options).then(response => {
    clearTimeout(timeout);
    if (!response.ok) {
      throw new CantLoadFileError(url);
    }

    return response;
  }).catch(err => {
    clearTimeout(timeout);

    throw err;
  });
}
