import PathProxyClient from "./path_proxy_client";

// Local cors-anywhere proxy started by `npm run dev` (see scripts/dev-proxy.cjs).
// Used only in development builds; the hosted proxy rejects the localhost origin.
const LOCAL_PROXY_URL = "http://localhost:8081/";

export default new PathProxyClient(LOCAL_PROXY_URL);
