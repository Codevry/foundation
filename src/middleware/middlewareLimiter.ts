import { createMiddleware } from "hono/factory";
import type { Context, Next } from "hono";
import type { TypeKey } from "@/src/types/typeKey.ts";
import Globals from "@/src/utils/globals.ts";
import CtrlLimits from "@/src/controller/ctrlLimits.ts";
import Time from "@/src/services/time.ts";
import { ErrorObject } from "@/src/utils/errorObject.ts";

export default createMiddleware(async (c: Context, next: Next) => {
    /**
     * set rate limiting headers on response
     */
    function setRateHeaders(remaining: number, keyData: TypeKey) {
        c.header("X-RateLimit-Limit", keyData.limit.toString());
        c.header("X-RateLimit-Remaining", remaining.toString());
        c.header(
            "X-RateLimit-Reset",
            Time.calculateRedisTTL(
                keyData.period,
                keyData.customPeriod
            ).toString()
        );
    }

    // key data
    const keyData: TypeKey = c.get("apiKeyData");

    // form the redis key name
    const key = `api:limits:${keyData.key}`;
    const limitValue = await Globals.dbRedis.get(key);
    if (limitValue) {
        const remaining = await CtrlLimits.decLimitKey(keyData.key).catch(
            (err) => {
                if (err instanceof ErrorObject) {
                    if (err.status === 429) {
                        const resetAt = Time.calculateRedisTTL(
                            keyData.period,
                            keyData.customPeriod
                        );
                        const resetIn = resetAt - Date.now();
                        setRateHeaders(0, keyData);
                        c.header("X-Retry-After", resetIn.toString());
                        c.status(429);
                        return c.json({
                            success: false,
                            message: "rate limit reached",
                            data: {
                                limit: keyData.limit,
                                remaining: 0,
                                resetInSeconds: resetIn,
                                resetAtTime: resetAt,
                            },
                        });
                    }
                } else throw err;
            }
        );
    }
    // create new limit
    else {
        await CtrlLimits.createLimitKey(keyData);
        setRateHeaders(keyData.limit, keyData);
        return next();
    }
});
