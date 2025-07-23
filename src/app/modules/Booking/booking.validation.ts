import { z } from "zod";

export const bookingValidation = z.object({
  body: z.object({
    resource: z.string({ required_error: "Resource is required" }),
    startTime: z.string({ required_error: "Start time is required" }),
    endTime: z.string({ required_error: "End time is required" }),
    requestedBy: z.string({ required_error: "RequestedBy is required" }),
  }),
});

export const userValidation = {
  bookingValidation,
};
