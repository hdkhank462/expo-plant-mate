export class AppErrors extends Error {
  name = "AppErrors";
  code?: string;

  constructor(error?: AppError) {
    super(error?.message);
    this.code = error?.code;
  }
}
