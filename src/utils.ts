import { StatusCode } from "hono/dist/utils/http-status";

// Status Codes (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
const STATUS_OKAY: StatusCode = 200;
const STATUS_FOUND: StatusCode = 300;
const STATUS_BAD_REQUEST: StatusCode = 400;
const STATUS_UNAUTHORIZED: StatusCode = 401;
const STATUS_PAYMENT_REQUIRED: StatusCode = 402;
const STATUS_FORBIDDEN: StatusCode = 403;
const STATUS_NOT_FOUND: StatusCode = 404;
const STATUS_TEAPOT: StatusCode = 418;

// MIME Types (https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)
const MIME_TYPE_JSON = "application/json";

// Gen
function bufferToHex(buffer: Uint8Array) {
    let str = "";
    let hex = "0123456789ABCDEF";
    buffer.forEach((v) => { str += hex[v >> 4] + hex[v & 15]; });
    return str;
}

export default {
    STATUS_OKAY,
    STATUS_FOUND,
    STATUS_BAD_REQUEST,
    STATUS_UNAUTHORIZED,
    STATUS_PAYMENT_REQUIRED,
    STATUS_FORBIDDEN,
    STATUS_NOT_FOUND,
    STATUS_TEAPOT,

    MIME_TYPE_JSON,

    bufferToHex
}
