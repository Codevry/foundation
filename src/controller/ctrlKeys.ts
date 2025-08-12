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
        };
    }
}
