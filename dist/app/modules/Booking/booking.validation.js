"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.bookingValidation = void 0;
const zod_1 = require("zod");
exports.bookingValidation = zod_1.z.object({
    body: zod_1.z.object({
        resource: zod_1.z.string({ required_error: "Resource is required" }),
        startTime: zod_1.z.string({ required_error: "Start time is required" }),
        endTime: zod_1.z.string({ required_error: "End time is required" }),
        requestedBy: zod_1.z.string({ required_error: "RequestedBy is required" }),
    }),
});
exports.userValidation = {
    bookingValidation: exports.bookingValidation,
};
