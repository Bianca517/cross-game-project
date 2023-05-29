"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//create our server
const express_1 = __importDefault(require("express"));
//pass our json request
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_1 = require("./controllers/error");
//create our application
//its gonna be an express method
const app = (0, express_1.default)();
//create a port
//SERVER OR LOCAL
const ports = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
//allow access to different pages and operalization
app.use((req, res, next) => {
    //any location can request thru API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Custom-Header, Authorization');
    next();
});
app.use('/auth', auth_1.default);
app.use(error_1.errorController.get404);
app.use(error_1.errorController.get500);
//listen to the port
app.listen(ports, () => console.log(`Listening on port ${ports}`));
//# sourceMappingURL=index.js.map