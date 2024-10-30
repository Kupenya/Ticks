import { Router } from "express";
import EventController from "../../controllers/eventController";
import authMiddleware from "../../../../middlewares/auth.middleware";

class EventRoutes extends EventController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }
  private routes(): void {
    this.router.use(authMiddleware.validateAccessToken);
    this.router
      .route("/")
      .get(this.index.bind(this))
      .post(this.create.bind(this));

    this.router
      .route("/:id")
      .get(this.getById.bind(this))
      .put(this.update.bind(this));
  }
}

export default new EventRoutes().router;
