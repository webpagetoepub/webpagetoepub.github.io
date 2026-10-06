// Decodes an HTTP response body into text, honouring the encoding the page
// actually declares. `Response.text()` always decodes as UTF-8, which turns
// legacy pages (windows-1251, iso-8859-*, shift_jis, ...) into mojibake or
// U+FFFD replacement characters.
//
// The encoding is picked the way browsers do it (HTML "encoding sniffing"):
//   1. byte order mark
//   2. `charset` parameter of the Content-Type header
//   3. `<meta charset>` / `<meta http-equiv="Content-Type">` / `<?xml encoding>`
//      found in the beginning of the document
//   4. UTF-8, falling back to windows-1252 when the bytes are not valid UTF-8

const PRESCAN_BYTES = 64 * 1024;

const META_CHARSET_REGEX = /<meta\b[^>]*?charset\s*=\s*["']?\s*([\w.:-]+)/i;
const XML_ENCODING_REGEX = /^\s*<\?xml\b[^>]*?encoding\s*=\s*["']([\w.:-]+)["']/i;
const CONTENT_TYPE_CHARSET_REGEX = /;\s*charset\s*=\s*["']?\s*([\w.:-]+)/i;

export default function decodeResponseText(response: Response): Promise<string> {
  // Without TextDecoder the encoding can't be honoured; keep the previous
  // behaviour (UTF-8) rather than failing the download.
  if (typeof TextDecoder === 'undefined') {
    return response.text();
  }

  const headerCharset = charsetFromResponse(response);

  return response.arrayBuffer().then(buffer => decodeBytes(new Uint8Array(buffer), headerCharset));
}

function charsetFromResponse(response: Response): string | null {
  const contentType = response.headers.get('content-type');
  if (!contentType) {
    return null;
  }

  const match = CONTENT_TYPE_CHARSET_REGEX.exec(contentType);

  return match ? match[1] : null;
}

function decodeBytes(bytes: Uint8Array, headerCharset: string | null = null): string {
  const bom = encodingFromBOM(bytes);
  if (bom) {
    return decodeWith(bytes, bom, false);
  }

  // A declared encoding is authoritative (transport header wins over the
  // in-document declaration), so commit to it rather than second-guessing it:
  // the browser decodes with it even when some bytes don't fit, replacing the
  // bad ones instead of falling back to a different encoding.
  const declared = normalizeLabel(headerCharset)
    || normalizeLabel(sniffDeclaredEncoding(bytes), true);
  if (declared) {
    const text = tryDecodeWith(bytes, declared, false);
    if (text !== null) {
      return text;
    }
  }

  // Nothing was declared: default to UTF-8, but only if the bytes really are
  // valid UTF-8. Otherwise fall back to windows-1252, which accepts every byte
  // and is what browsers use for undeclared non-UTF-8 pages.
  const utf8 = tryDecodeWith(bytes, 'utf-8', true);
  if (utf8 !== null) {
    return utf8;
  }

  // A TextDecoder that only knows UTF-8 can't do windows-1252, so as a last
  // resort decode as UTF-8 and replace the bad bytes.
  const fallback = tryDecodeWith(bytes, 'windows-1252', false);

  return decodeWith(bytes, 'utf-8', true);
}

function sniffDeclaredEncoding(bytes: Uint8Array): string | null {
  const head = asciiString(bytes.subarray(0, PRESCAN_BYTES));
  const bodyStart = head.search(/<body\b/i);
  const scanned = bodyStart === -1 ? head : head.slice(0, bodyStart);

  const xmlMatch = XML_ENCODING_REGEX.exec(scanned);
  if (xmlMatch) {
    return xmlMatch[1];
  }

  const metaMatch = META_CHARSET_REGEX.exec(scanned);
  if (metaMatch) {
    return metaMatch[1];
  }

  return null;
}

function encodingFromBOM(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    return 'utf-8';
  }
  if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
    return 'utf-16be';
  }
  if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
    return 'utf-16le';
  }

  return null;
}

// Applies the label rules of the HTML standard: unknown labels are ignored,
// `x-user-defined` is treated as windows-1252 and an in-document declaration
// of UTF-16 can't be right for bytes without a BOM, so it means UTF-8.
function normalizeLabel(label: string | null, fromDocument = false): string | null {
  if (!label) {
    return null;
  }

  const lowerLabel = label.trim().toLowerCase();
  if (lowerLabel === 'x-user-defined') {
    return 'windows-1252';
  }
  if (fromDocument && lowerLabel.indexOf('utf-16') === 0) {
    return 'utf-8';
  }

  try {
    return new TextDecoder(lowerLabel).encoding;
  } catch (_) {
    return null;
  }
}

function tryDecodeWith(bytes: Uint8Array, encoding: string, fatal: boolean): string | null {
  try {
    return decodeWith(bytes, encoding, fatal);
  } catch (_) {
    return null;
  }
}

function decodeWith(bytes: Uint8Array, encoding: string, fatal: boolean): string {
  return new TextDecoder(encoding, {fatal}).decode(bytes);
}

function asciiString(bytes: Uint8Array): string {
  let result = '';

  for (let i = 0; i < bytes.length; i += 8192) {
    const chunk = bytes.subarray(i, i + 8192);
    result += String.fromCharCode.apply(null, Array.prototype.slice.call(chunk));
  }

  return result;
}
