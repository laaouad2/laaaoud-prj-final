import { StatusCodes } from "http-status-codes";
import CustomApiError from "./api.js";



export class UnAuthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.UNAUTHORIZED;
  }
}
