import directClient from "./direct";
import webpageToEpubClient from "./proxy_webpagetoepub";
import localProxyClient from "./proxy_local";
import Client from "./client";

// In development the hosted proxy rejects the localhost origin, so swap it for
// the local cors-anywhere proxy (see proxy_local.ts / scripts/dev-proxy.mts).
const PROXY_CLIENTS =
  process.env.NODE_ENV === "development"
    ? [localProxyClient]
    : [webpageToEpubClient];

export function requestTextContent(url: string) {
  return request((client) => client.requestTextContent(url));
}

export function loadFileFrom(url: string) {
  return request((client) => client.loadFileFrom(url));
}

function request<T>(execute: (client: Client) => Promise<T>) {
  const clients = sortRandomProxyClients();
  let lastPromise = execute(directClient);

  for (const client of clients) {
    lastPromise = lastPromise.catch((_) => execute(client));
  }

  return lastPromise;
}

function sortRandomProxyClients() {
  const newProxyClients = PROXY_CLIENTS.concat([]);

  return newProxyClients.sort(function () {
    if (Math.random() > Math.random()) {
      return 1;
    }

    return -1;
  });
}
