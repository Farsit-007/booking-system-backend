import AppError from "../../../errors/AppError";
import prisma from "../../../shared/prisma";
import { TBooking } from "./booking.interface";
import httpStatus from "http-status";

const isOverlappingWithBuffer = (
  existingStart: Date,
  existingEnd: Date,
  newStart: Date,
  newEnd: Date,
  bufferMinutes = 10
): boolean => {
  const bufferStart = new Date(
    existingStart.getTime() - bufferMinutes * 60 * 1000
  );
  const bufferEnd = new Date(existingEnd.getTime() + bufferMinutes * 60 * 1000);
  return newStart < bufferEnd && newEnd > bufferStart;
};

const createBooking = async (payload: TBooking) => {
  const { resource, startTime, endTime, requestedBy } = payload;

   const start = new Date(startTime);
  const end = new Date(endTime);

  start.setSeconds(0, 0);
  end.setSeconds(0, 0);
  const now = new Date();
  if (start < now) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start time cannot be in the past."
    );
  }

  const durationMs = end.getTime() - start.getTime();
  const maxDurationMs = 2 * 60 * 60 * 1000;

  if (end <= start || durationMs < 15 * 60 * 1000) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid booking time or duration too short."
    );
  }

  if (durationMs > maxDurationMs) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking duration cannot exceed 2 hours."
    );
  }

  // Get existing bookings for the same resource
  const existingBookings = await prisma.booking.findMany({
    where: { resource },
  });

  // Check conflicts with buffer
  const hasConflict = existingBookings.some((booking) =>
    isOverlappingWithBuffer(
      new Date(booking.startTime),
      new Date(booking.endTime),
      start,
      end
    )
  );

  if (hasConflict) {
    throw new AppError(httpStatus.BAD_REQUEST, "The slot is already booked");
  }

  const newBooking = await prisma.booking.create({
    data: {
      resource,
      startTime: start,
      endTime: end,
      requestedBy,
    },
  });

  return newBooking;
};

const getAllBookings = async (params?: {
  resource?: string;
  date?: string;
}) => {
  const whereClause: any = {};

  if (params?.resource) {
    whereClause.resource = params.resource;
  }

  if (params?.date) {
    const selectedDate = new Date(params.date);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);

    whereClause.startTime = {
      gte: selectedDate,
      lt: nextDate,
    };
  }

  const bookings = await prisma.booking.findMany({
    where: whereClause,
    orderBy: { startTime: "asc" },
  });

  const now = new Date();

  const getStatusRank = (booking: any) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    if (now < start) return 0;
    if (now > end) return 2;
    return 1;
  };

  bookings.sort((a, b) => {
    const statusA = getStatusRank(a);
    const statusB = getStatusRank(b);

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return bookings;
};

const deleteBookings = async (id: string) => {
  const result = await prisma.booking.delete({
    where: { id },
  });

  return result;
};

const getAvailableSlots = async (params?: { date?: string }) => {
  const whereClause: any = {};

  if (params?.date) {
   const selectedDate = new Date(params.date);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);

    whereClause.startTime = {
      gte: selectedDate,
      lt: nextDate,
    };
  } else {
    const today = new Date();
    console.log(today);
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 1);
    whereClause.startTime = {
      gte: today,
      lt: nextDate,
    };
  }

  const bookings = await prisma.booking.findMany({
    where: whereClause,
  });

  return bookings;
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  deleteBookings,
  getAvailableSlots,
};
