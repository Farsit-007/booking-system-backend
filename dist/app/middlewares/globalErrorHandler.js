"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleDuplicateError_1 = __importDefault(require("../../errors/handleDuplicateError"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const config_1 = __importDefault(require("../../config"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'A server error occurred.';
    let errorSources = [
        {
            path: '',
            message: 'A server error occurred.',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        stack: config_1.default.node_env === 'development'
            ? err === null || err === void 0 ? void 0 : err.stack
            : 'Optional stack trace shown only in development',
    });
};
exports.default = globalErrorHandler;
