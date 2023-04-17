export class HttpError extends Error {
    private _statusCode: number;
    constructor(message: string) {
      super(message);
    }

    public set statusCode(statusCode : number) {
        this._statusCode = statusCode;
    }

    public get statusCode() {
        return this._statusCode;
    }
  }