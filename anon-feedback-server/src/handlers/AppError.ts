 



export class AppError extends Error {
    public readonly statusCode: number 
    public readonly code?: string
    public typeError?: string


    constructor(message: string, statusCode: number, code?: string, typeError?: string) {
        super(message)
        this.statusCode = statusCode;
        this.code = code
        this.typeError = typeError
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)
    }

   


}