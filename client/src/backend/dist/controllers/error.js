"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorController = void 0;
const http_error_1 = require("../models/http-error");
class errorController {
    get404(req, res, next) {
        const error = new http_error_1.HttpError("Not found.");
        error.statusCode = 404;
        next(error);
    }
    get500(error, req, res, next) {
        res.status(error.statusCode || 500);
        res.json({
            error: {
                message: error.message,
            },
        });
    }
}
exports.errorController = errorController;
//# sourceMappingURL=error.js.map