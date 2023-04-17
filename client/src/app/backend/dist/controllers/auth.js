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
exports.signupController = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    //if there are errors
    //if (errors.isEmpty()) return;
    console.log("req " + JSON.stringify(req.body));
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const userDetails = new user_1.User(firstName, lastName, email, hashedPassword);
        try {
            const result = yield user_1.User.find(email);
            user_1.User.save(userDetails);
            res.status(201).json({ message: "User registered!" });
        }
        catch (err) {
            res.status(405).json({ message: err.message });
        }
    }
    catch (err) {
        //handle
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.signupController = signupController;
//# sourceMappingURL=auth.js.map