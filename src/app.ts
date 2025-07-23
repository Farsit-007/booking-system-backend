import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import cron from 'node-cron';
import globalErrorHandler from "./app/middlewares/globalErrorHandler";


const app: Application = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Mini Booking app",
  });
});


app.use("/api", router);
app.use(globalErrorHandler);
app.use(notFound);
export default app;
