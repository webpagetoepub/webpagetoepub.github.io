// Local CORS proxy for `npm run dev`. The hosted proxy_webpagetoepub rejects
// non-website origins, so development serves requests through cors-anywhere
// running on localhost. Path-style interface: http://localhost:8081/<target>.
// Run directly with `node scripts/dev-proxy.mts` (Node strips the types).
import corsAnywhere from "cors-anywhere";

const HOST = "localhost";
const PORT = 8081;

corsAnywhere.createServer({}).listen(PORT, HOST, () => {
  console.log(`Local CORS proxy running on http://${HOST}:${PORT}/`);
});
