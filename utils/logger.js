'use strict';

const pino = require('pino');
const fs = require('fs');

let stream = process.stdout;

if (process.env.NODE_ENV === 'test') {
  stream = fs.createWriteStream('/dev/null');
}

const logger = pino({
  serializers: {
    err: pino.stdSerializers.err,
  },
}, stream);

module.exports = logger;