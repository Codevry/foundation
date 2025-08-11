import { DbRedis } from "@/src/services/dbRedis.ts";

const redis = new DbRedis();
await redis.connect().catch((err) => {
    console.error(err);
    process.exit(1);
});

console.log("connected to redis");
