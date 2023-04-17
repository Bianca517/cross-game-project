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
exports.User = void 0;
const database_1 = __importDefault(require("../util/database"));
class User {
    constructor(_firstName, _lastName, _email, _password) {
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._email = _email;
        this._password = _password;
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._email = _email;
        this._password = _password;
        this._gamesWon = 0;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(firstName) {
        this._firstName = firstName;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(lastName) {
        this._lastName = lastName;
    }
    get email() {
        return this._email;
    }
    set email(email) {
        this._email = email;
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this._password = password;
    }
    static find(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //need to use await for db operations, otherwise => undefined
            const result = yield database_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (result[0].length > 0) {
                return Promise.reject(new Error('Email address already exists!'));
            }
        });
    }
    static save(user) {
        return database_1.default.execute('INSERT INTO users (firstName, lastName, email, password, gamesWon) VALUES (?, ?, ?, ?, ?)', [user._firstName, user._lastName, user._email, user._password, 0]);
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map