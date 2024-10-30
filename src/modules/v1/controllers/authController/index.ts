import { NextFunction, Request, Response } from "express";
import authService from "../../../../services/authService";
import apiResponse from "../../../../utils/apiResponse";
import userService from "../../../../services/userService";

export default class AuthController {
  protected async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: { email, password },
      } = req;

      const user = await userService.getByEmailAndPassword(email, password);

      const data = await authService.login(user);

      return apiResponse.successResponse(res, 200, "Login Successful", data);
    } catch (error) {
      next(error);
    }
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { user: data } = req;

      return apiResponse.successResponse(
        res,
        200,
        "User retreived successfully",
        data
      );
    } catch (error) {
      next(error);
    }
  }

  protected async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { body } = req;

      const user = await authService.register(body);

      return apiResponse.successResponse(
        res,
        201,
        "Registration Successful",
        user
      );
    } catch (error) {
      next(error);
    }
  }

  public async registerAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { body } = req;

      const admin = await authService.registerAdmin(body);

      return apiResponse.successResponse(
        res,
        201,
        "Admin Registration Successful",
        admin
      );
    } catch (error) {
      next(error);
    }
  }
}
