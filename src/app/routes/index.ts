import express from "express";
import { BookingRoutes } from "../modules/Booking/booking.routes";

const router = express.Router();

 const modulesRoutes = [
  {
    path: "/bookings",
    route: BookingRoutes,
  }
  
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
