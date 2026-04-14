import directClient from './direct';
import mangaraikuClient from './proxy_mangaraiku';
import codetabsClient from './proxy_codetabs';
import alloriginsClient from './proxy_allorigins';
import Client from './client';


const PROXY_CLIENTS = [mangaraikuClient, codetabsClient, alloriginsClient];

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
