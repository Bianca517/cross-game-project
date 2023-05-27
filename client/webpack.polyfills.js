const crypto = require('crypto-browserify');
const zlib = require('browserify-zlib');

global.crypto = crypto;
global.zlib = zlib;
