import { Router } from "express";
import AuthController from "../../controllers/authController";
import authMiddleware from "../../../../middlewares/auth.middleware";
import customMiddleware from "../../../../middlewares/custom.middleware";
import userValidator from "../../../../utils/validators/user.validator";

class AuthRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route("/login")
      .post(
        customMiddleware.validateRequestBody(userValidator.loginSchema),
        this.login
      );

    this.router
      .route("/register")
      .post(
        customMiddleware.validateRequestBody(userValidator.registerSchema),
        this.register
      );

    this.router
      .route("/admin/register")
      .post(
        customMiddleware.validateRequestBody(userValidator.registerSchema),
        this.registerAdmin
      );

    this.router.get("/", authMiddleware.validateAccessToken, this.get);
  }
}

export default new AuthRoutes().router;
