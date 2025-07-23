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

  return (
    (newStart >= bufferStart && newStart <= bufferEnd) ||
    (newEnd >= bufferStart && newEnd <= bufferEnd) ||
    (newStart <= bufferStart && newEnd >= bufferEnd)
  );
};

const createBooking = async (payload: TBooking) => {
  const { resource, startTime, endTime, requestedBy } = payload;

  const start = new Date(startTime);
  const end = new Date(endTime);
  start.setSeconds(0, 0);
  end.setSeconds(0, 0);

  const now = new Date();
  now.setSeconds(0, 0);

  if (start < now) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start time cannot be in the past."
    );
  }

  const durationMs = end.getTime() - start.getTime();
  const minDurationMs = 15 * 60 * 1000;
  const maxDurationMs = 2 * 60 * 60 * 1000;

  if (end <= start) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End time must be after start time."
    );
  }

  if (durationMs < minDurationMs) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking duration must be at least 15 minutes."
    );
  }

  if (durationMs > maxDurationMs) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking duration cannot exceed 2 hours."
    );
  }

  const bufferMs = 10 * 60 * 1000;

  const existingBookings = await prisma.booking.findMany({
    where: {
      startTime: {
        lte: new Date(end.getTime() + bufferMs),
      },
      endTime: {
        gte: new Date(start.getTime() - bufferMs),
      },
    },
  });

  const isExactMatch = existingBookings.some(
    (b) =>
      new Date(b.startTime).getTime() === start.getTime() &&
      new Date(b.endTime).getTime() === end.getTime()
  );

  if (isExactMatch) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A booking already exists at this exact time range across all resources."
    );
  }

  const normalize = (date: Date) => {
    const d = new Date(date);
    d.setSeconds(0, 0);
    return d;
  };

  const hasConflict = existingBookings.some((b) =>
    isOverlappingWithBuffer(
      normalize(new Date(b.startTime)),
      normalize(new Date(b.endTime)),
      start,
      end,
      10
    )
  );

  if (hasConflict) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This time slot (including buffer period) is already booked across all resources."
    );
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
