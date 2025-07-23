import express from "express";
import { BookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { bookingValidation } from "./booking.validation";

const router = express.Router();
router.post(
  "/",
  validateRequest(bookingValidation),
  BookingController.createBooking
);


router.get(
  "/",
  BookingController.getAllBookings
);

router.delete(
  "/:id",
  BookingController.deleteBook
);

router.get(
  "/available-slots",
  BookingController.getAvailableSlots
);

export const BookingRoutes = router;
