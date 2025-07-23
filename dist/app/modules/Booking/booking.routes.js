"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(booking_validation_1.bookingValidation), booking_controller_1.BookingController.createBooking);
router.get("/", booking_controller_1.BookingController.getAllBookings);
router.delete("/:id", booking_controller_1.BookingController.deleteBook);
router.get("/available-slots", booking_controller_1.BookingController.getAvailableSlots);
exports.BookingRoutes = router;
