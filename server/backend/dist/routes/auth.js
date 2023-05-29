"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//this is where we do validation
//server needs to validate that an email exists
const express_validator_1 = require("express-validator");
//this intercepts the body(fields you sent thru the server) and validate it to go to the next route
//server side validation for the input
//this allows to make requests from another location
const signUpRouter = express_1.default.Router();
const auth_1 = require("../controllers/auth");
signUpRouter.post('/signup', [
    (0, express_validator_1.body)('firstName').trim(),
    (0, express_validator_1.body)('lastName').trim(),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        //const user = await User.find(email);
    }))
        .normalizeEmail(),
    (0, express_validator_1.body)('password').trim().isLength({ min: 7 }),
], auth_1.signupController);
exports.default = signUpRouter;
//# sourceMappingURL=auth.js.map