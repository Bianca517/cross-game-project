"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message) {
        super(message);
    }
    set statusCode(statusCode) {
        this._statusCode = statusCode;
    }
    get statusCode() {
        return this._statusCode;
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map