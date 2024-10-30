import { Router } from "express";
import authRoutes from "./authRoutes";
import eventRoutes from "./eventRoutes";
import bookingRoutes from "./bookingRoutes";

import { NotFoundError } from "../../../utils/errors";

class V1Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use("/auth", authRoutes);
    this.router.use("/event", eventRoutes);
    this.router.use("/booking", bookingRoutes);

    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is currently under construction"
      );
    });
  }
}

export default new V1Routes().router;
