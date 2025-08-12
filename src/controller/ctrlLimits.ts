/**
 * @info handle limits
 */
import type { TypeKey } from "@/src/types/typeKey.ts";
import Time from "@/src/services/time.ts";
import { ErrorObject } from "@/src/utils/errorObject.ts";
import Globals from "@/src/utils/globals.ts";

export default class CtrlLimits {
    /**
     * create a new rate-limiting key
     * @param keyData
     */
    static async createLimitKey(keyData: TypeKey) {
        // calculate ttl
        const ttl = Time.calculateRedisTTL(
            keyData.period,
            keyData.customPeriod
        );

        // create a new entry in redis
        await Globals.dbRedis
            .create(`api:limits:${keyData.key}`, keyData.limit)
            .catch((err: any) => new ErrorObject(502, err));

        // set expiry
        await Globals.dbRedis
            .setTTL(`api:limits:${keyData.key}`, ttl)
            .catch((err) => new ErrorObject(502, err));
    }

    /**
     * dec the value and return the remaining count
     * @param key
     */
    static async decLimitKey(key: string) {
        const data = await Globals.dbRedis.get(`api:limits:${key}`);
        if (Number(data) === 0) throw new ErrorObject(429, "limit reached");
        else {
            await Globals.dbRedis
                .dec(`api:limits:${key}`)
                .catch((err) => new ErrorObject(502, err));

            return Number(Number(data) - 1);
        }
    }
}
