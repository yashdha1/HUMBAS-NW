import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.UPSTASH_REDIS_URL) {
  console.warn("WARNING: UPSTASH_REDIS_URL not set. Redis features will not work.");
}

export const redis = new Redis(process.env.UPSTASH_REDIS_URL || "redis://localhost:6379", {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: false,
});

redis.on("connect", () => {
  console.log("Redis client connecting...");
});

redis.on("ready", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redis.on("close", () => {
  console.warn("Redis connection closed");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});