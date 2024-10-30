import { Router } from "express";
import BookingController from "../../controllers/bookingController";
import bookingValidator from "../../../../utils/validators/booking.validator";

class BookingRoutes extends BookingController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route("/")
      .post(bookingValidator.validateCreateBooking, this.create)
      .get(this.index);

    this.router.route("/:id").delete(this.cancelBooking);

    this.router.route("/status/:eventId").get(this.getEventStatus);
  }
}

export default new BookingRoutes().router;
