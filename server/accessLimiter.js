import rateLimit from "express-rate-limit";

export const journalsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: "Too many requests, please slow down." }
});