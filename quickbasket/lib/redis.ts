import Redis from "ioredis"

declare global {
    var redisClient: Redis | undefined
}

const redis = global.redisClient || new Redis(process.env.REDIS_URL!)

if (process.env.NODE_ENV !== "production") {
    global.redisClient = redis
}

export default redis