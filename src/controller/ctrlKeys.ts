import type { TypeKeyGenerated } from "@/src/types/typeKey.ts";
import { z } from "zod";
import Globals from "@/src/utils/globals.ts";
import type SchemaKeys from "@/src/schema/schemaKeys.ts";
import { ErrorObject } from "@/src/utils/errorObject.ts";

export default class CtrlKeys {
    /**
     * generate a new api key
     */
    async generate(body: z.infer<typeof SchemaKeys.generate.body>) {
        const key: string = crypto.randomUUID();
        await Globals.dbRedis
            .create(`api:keys:${key}`, {
                key,
                ...body,
            })
            .catch((e) => new ErrorObject(502, e));

        return {
            key,
            ...body,
        };
    }

    /**
     * modify api key
     */
    async modify(body: z.infer<typeof SchemaKeys.modify.body>) {
        // check key exists
        const check = await Globals.dbRedis
            .exists(`api:keys:${body.key}`)
            .catch((err) => new ErrorObject(502, err));

        // if not then throw error
        if (!check) throw new ErrorObject(404, "key not found");

        // modify data
        await Globals.dbRedis
            .create(`api:keys:${body.key}`, body)
            .catch((err) => new ErrorObject(502, err));

        return { ...body };
    }

    /**
     * delete api key
     */
    async deleteKey(key: string) {
        const count = await Globals.dbRedis.delete(`api:keys:${key}`);
        if (count === 0) throw new ErrorObject(404, "key not found");
        else
            return {
                success: true,
                message: `key ${key} deleted`,
            };
    }

    /**
     * get key data
     * @param key
     */
    async getKey(key: string) {
        const data = await Globals.dbRedis.get(`api:keys:${key}`);
        if (!data) throw new ErrorObject(404, "key not found");
        else return JSON.parse(data);
    }
}
