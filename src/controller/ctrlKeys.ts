import type { TypeKeyGenerated } from "@/src/types/typeKey.ts";
import { z } from "zod";
import Globals from "@/src/utils/globals.ts";
import type SchemaKeys from "@/src/schema/schemaKeys.ts";

export default class CtrlKeys {
    /**
     * generate a new api key
     */
    async generate(body: z.infer<typeof SchemaKeys.generate.body>) {
        const key: string = crypto.randomUUID();
        await Globals.dbRedis.create(`api:keys:${key}`, {
            key,
            ...body,
        });

        return {
            key,
        };
    }
}
