import Redis from "ioredis";
import type {
    TypeRedisOptions,
    TypeRedisStatus,
} from "@/src/types/typeRedis.ts";

export class DbRedis {
    redis: Redis;

    constructor(options: TypeRedisOptions) {
        this.redis = new Redis(options);
    }

    /**
     * get current redis connection status
     */
    status(): TypeRedisStatus {
        return this.redis.status;
    }

    /**
     * wait until the connection is established
     */
    async connect() {
        while (this.status() !== "ready") {
            if (this.status() === "end" || this.status() === "close")
                throw new Error("failed to connect to database");
            else await Bun.sleep(100);
        }

        return true;
    }

    /**
     * create a new key
     * @param key
     * @param value
     */
    async create(key: string, value: string | number | object) {
        let data;
        data = typeof value === "object" ? JSON.stringify(value) : value;
        return this.redis.set(key, data);
    }

    /**
     * get key
     * @param key
     */
    async get(key: string) {
        return this.redis.get(key);
    }

    /**
     * check if the key exists
     * @param key
     */
    async exists(key: string) {
        return this.redis.exists(key);
    }

    /**
     * delete key
     * @param key
     */
    async delete(key: string) {
        return this.redis.del(key);
    }
}
