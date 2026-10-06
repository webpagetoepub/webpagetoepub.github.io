import directClient from './direct';
import webpageToEpubClient from './proxy_webpagetoepub';
import Client from './client';


const PROXY_CLIENTS = [webpageToEpubClient];

export function requestTextContent(url: string) {
  return request(client => client.requestTextContent(url));
}

export function loadFileFrom(url: string) {
  return request(client => client.loadFileFrom(url));
}

function request<T>(execute: (client: Client) => Promise<T>) {
  const clients = sortRandomProxyClients();
  let lastPromise = execute(directClient);

  for (const client of clients) {
    lastPromise = lastPromise.catch(_ => execute(client));
  }

  return lastPromise;
}

function sortRandomProxyClients() {
  const newProxyClients = PROXY_CLIENTS.concat([]);

  return newProxyClients.sort(function() {
    if (Math.random() > Math.random()) {
      return 1;
    }

    return -1;
  });
}
