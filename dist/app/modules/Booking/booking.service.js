"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const isOverlappingWithBuffer = (existingStart, existingEnd, newStart, newEnd, bufferMinutes = 10) => {
    const bufferStart = new Date(existingStart.getTime() - bufferMinutes * 60 * 1000);
    const bufferEnd = new Date(existingEnd.getTime() + bufferMinutes * 60 * 1000);
    return newStart < bufferEnd && newEnd > bufferStart;
};
const createBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { resource, startTime, endTime, requestedBy } = payload;
    const start = new Date(startTime);
    const end = new Date(endTime);
    start.setSeconds(0, 0);
    end.setSeconds(0, 0);
    const now = new Date();
    if (start < now) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Start time cannot be in the past.");
    }
    const durationMs = end.getTime() - start.getTime();
    const maxDurationMs = 2 * 60 * 60 * 1000;
    if (end <= start || durationMs < 15 * 60 * 1000) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid booking time or duration too short.");
    }
    if (durationMs > maxDurationMs) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking duration cannot exceed 2 hours.");
    }
    // Get existing bookings for the same resource
    const existingBookings = yield prisma_1.default.booking.findMany({
        where: { resource },
    });
    // Check conflicts with buffer
    const hasConflict = existingBookings.some((booking) => isOverlappingWithBuffer(new Date(booking.startTime), new Date(booking.endTime), start, end));
    if (hasConflict) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "The slot is already booked");
    }
    const newBooking = yield prisma_1.default.booking.create({
        data: {
            resource,
            startTime: start,
            endTime: end,
            requestedBy,
        },
    });
    return newBooking;
});
const getAllBookings = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = {};
    if (params === null || params === void 0 ? void 0 : params.resource) {
        whereClause.resource = params.resource;
    }
    if (params === null || params === void 0 ? void 0 : params.date) {
        const selectedDate = new Date(params.date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1);
        whereClause.startTime = {
            gte: selectedDate,
            lt: nextDate,
        };
    }
    const bookings = yield prisma_1.default.booking.findMany({
        where: whereClause,
        orderBy: { startTime: "asc" },
    });
    const now = new Date();
    const getStatusRank = (booking) => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        if (now < start)
            return 0;
        if (now > end)
            return 2;
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
});
const deleteBookings = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.delete({
        where: { id },
    });
    return result;
});
const getAvailableSlots = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = {};
    if (params === null || params === void 0 ? void 0 : params.date) {
        const selectedDate = new Date(params.date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1);
        whereClause.startTime = {
            gte: selectedDate,
            lt: nextDate,
        };
    }
    else {
        const today = new Date();
        console.log(today);
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1);
        whereClause.startTime = {
            gte: today,
            lt: nextDate,
        };
    }
    const bookings = yield prisma_1.default.booking.findMany({
        where: whereClause,
    });
    return bookings;
});
exports.BookingServices = {
    createBooking,
    getAllBookings,
    deleteBookings,
    getAvailableSlots,
};
