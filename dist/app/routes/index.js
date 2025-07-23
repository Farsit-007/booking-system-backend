"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_routes_1 = require("../modules/Booking/booking.routes");
const router = express_1.default.Router();
const modulesRoutes = [
    {
        path: "/bookings",
        route: booking_routes_1.BookingRoutes,
    }
];
modulesRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
