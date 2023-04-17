import db from '../util/database';

export class User {
  private _gamesWon: Number;

  constructor(private _firstName: String, private _lastName: String, private _email: String, private _password: String) {
    this._firstName = _firstName;
    this._lastName = _lastName;
    this._email = _email;
    this._password = _password;
    this._gamesWon = 0;
  }

  public get firstName() : String {
    return this._firstName;
  }

  public set firstName(firstName: String) {
    this._firstName = firstName;
  }

  public get lastName() : String {
    return this._lastName;
  }

  public set lastName(lastName: String) {
    this._lastName = lastName;
  }

  public get email() : String {
    return this._email;
  }

  public set email(email: String) {
    this._email = email;
  }

  public get password() : String {
    return this._password;
  }

  public set password(password: String) {
    this._password = password;
  }
}
