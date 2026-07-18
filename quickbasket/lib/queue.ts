import { Queue } from "bullmq"
import Redis from "ioredis"

const connection = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null   // BullMQ ko ye chahiye hota hai
})

export const emailQueue = new Queue("email-queue", { connection })