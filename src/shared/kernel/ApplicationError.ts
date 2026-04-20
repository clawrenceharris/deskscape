export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class AuthenticationError extends ApplicationError{
  constructor(message: string){
    super(message);
  }
}