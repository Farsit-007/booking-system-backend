import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api not found",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
};
