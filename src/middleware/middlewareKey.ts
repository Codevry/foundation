import { bearerAuth } from "hono/bearer-auth";
import type { Context } from "hono";
import Globals from "@/src/utils/globals.ts";
import type { TypeKey } from "@/src/types/typeKey.ts";

export default function () {
    return bearerAuth({
        verifyToken: async (token: string, c: Context) => {
            const data = await Globals.dbRedis.get(`api:keys:${token}`);
            if (!data) return false;
            else {
                c.set("apiKeyData", JSON.parse(data) as TypeKey);
                return true;
            }
        },
        noAuthenticationHeaderMessage: {
            success: false,
            message: "no bearer token (key) provided",
        },
        invalidTokenMessage: {
            success: false,
            message: "invalid bearer token (key)",
        },
    });
}
