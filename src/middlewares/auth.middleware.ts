import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors";
import jwtUtil from "../utils/jwtUtil";
import userService from "../services/userService";
import { User } from "../db/models";

class AuthMiddleware {
  public async validateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new UnauthorizedError("Missing Access Token"));
      }

      const accesstoken = authHeader.split(" ")[1];

      const { payload, expired } = jwtUtil.verify(accesstoken as string);

      if (expired) {
        return next(new UnauthorizedError("Token has expired."));
      }

      const user = await userService.getById((payload as User)?.id);

      if (!user) {
        return next(new UnauthorizedError("Invalid token."));
      }

      req.user = user;

      // Call the next middleware
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      next(error);
    }
  }
}

export default new AuthMiddleware();
