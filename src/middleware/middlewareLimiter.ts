import { createMiddleware } from "hono/factory";
import type { Context, Next } from "hono";
import type { TypeKey } from "@/src/types/typeKey.ts";
import Globals from "@/src/utils/globals.ts";
import Time from "@/src/services/time.ts";
import { ErrorObject } from "@/src/utils/errorObject.ts";

export default createMiddleware(async (c: Context, next: Next) => {
    // fetch key data
    const keyData: TypeKey = c.get("apiKeyData");

    // get next window
    const resetAt = Time.calculateRedisTTL(
        keyData.period,
        keyData.customPeriod
    );

    // set rate-limiting headers
    function setRateHeaders(remaining: number) {
        c.header("X-RateLimit-Limit", keyData.limit.toString());
        c.header("X-RateLimit-Remaining", remaining.toString());
        c.header("X-RateLimit-Reset", resetAt.toString());
    }

    // get limit value
    const key = `api:limits:${keyData.key}`;
    const limit = await Globals.dbRedis.get(key);

    // if value exists
    if (limit) {
        const limitValue = Number(limit);

        // limit exceeded
        if (limitValue === 0) {
            // get a reset window in seconds
            const resetIn = resetAt - Date.now();

            // set rate headers
            setRateHeaders(0);
            c.header("X-Retry-After", resetIn.toString());

            // set status and return error
            c.status(429);
            return c.json({
                success: false,
                message: "rate limit reached",
                data: {
                    limit: keyData.limit,
                    remaining: 0,
                    reset: {
                        inSeconds: resetIn,
                        atTime: resetAt,
                    },
                },
            });
        }

        // else decrement counter, set headers and proceed
        else {
            // decrement counter
            await Globals.dbRedis
                .dec(`api:limits:${keyData.key}`)
                .catch((err) => new ErrorObject(502, err));

            // set headers & proceed
            setRateHeaders(limitValue - 1);
            return next();
        }
    }

    // create new limit
    else {
        // create a new entry in redis
        await Globals.dbRedis
            .create(`api:limits:${keyData.key}`, keyData.limit)
            .catch((err: any) => new ErrorObject(502, err));

        // set expiry
        await Globals.dbRedis
            .setTTL(`api:limits:${keyData.key}`, resetAt)
            .catch((err) => new ErrorObject(502, err));

        setRateHeaders(keyData.limit);
        return next();
    }
});
