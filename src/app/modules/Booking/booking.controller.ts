import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { BookingServices } from "./booking.service";
import pick from "../../../shared/pick";

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.createBooking(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Slot Booked Successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["resource", "date"]);
  const result = await BookingServices.getAllBookings(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings fetched successfully",
    data: result,
  });
});

const deleteBook = catchAsync(async (req, res) => {
  const result = await BookingServices.deleteBookings(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings deleted successfully",
    data: result,
  });
});

const getAvailableSlots = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["date"]);
  const result = await BookingServices.getAvailableSlots(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability fetched successfully",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  deleteBook,
  getAvailableSlots,
};
