import { bearerAuth } from "hono/bearer-auth";
import type { Context } from "hono";
import Globals from "@/src/utils/globals.ts";

export default function () {
    return bearerAuth({
        verifyToken: async (token: string, c: Context) => {
            return await Globals.dbRedis.exists(`api:keys:${token}`);
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
