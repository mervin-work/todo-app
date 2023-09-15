'use strict';

module.exports = {
    salt_rounds: 10,
    nonce_length: 64, // 128 characters (since 2 characters represent 1 byte in hexadecimal format),
    session_max_age: 3600,
    session_id_length: 32,
    max_requests_per_minute: 5 // for rate limiter
};