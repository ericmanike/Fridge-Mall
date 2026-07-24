import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/login",
});

export const otpRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "3 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/otp", 
});



export const orderRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/order",
});

