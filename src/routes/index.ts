import { NextFunction, Request, Response, Router } from "express";
import apiResponse from "../utils/apiResponse";
import customMiddleware from "../middlewares/custom.middleware";
import { NotFoundError } from "../utils/errors";
import config from "../config";
import v1Routes from "../modules/v1/v1Routes";

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    // Base route
    this.router.get("/", (req: Request, res: Response, next: NextFunction) => {
      const data: object = {
        developer: "Glory Alphonsus",
      };

      return apiResponse.successResponse(res, 200, "TICKS", data);
    });

    this.router.use(customMiddleware.formatRequestQuery);

    // V1 Routes
    this.router.use(`${config.V1_URL}`, v1Routes);

    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is currently in construction"
      );
    });
  }
}

export default new Routes().router;
