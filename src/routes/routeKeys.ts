/**
 * @info all admin routes
 */

import { type Context, Hono } from "hono";
import middlewareAdmin from "@/src/middleware/middlewareAdmin.ts";
import { MiddlewareSchemaValidate } from "@/src/middleware/middlewareSchema.ts";
import schemaKeys from "@/src/schema/schemaKeys.ts";
import Globals from "@/src/utils/globals.ts";
import { MiddlewareResponse } from "@/src/middleware/middlewareResponse.ts";

const app = new Hono();

app.use(middlewareAdmin());

// create a new api key
app.post(
    "/",
    MiddlewareSchemaValidate(schemaKeys.generate),
    MiddlewareResponse(async (c: Context) => {
        return Globals.ctrlKeys.generate(await c.req.json());
    })
);

// modify the existing key
app.put(
    "/",
    MiddlewareSchemaValidate(schemaKeys.modify),
    MiddlewareResponse(async (c: Context) => {
        return Globals.ctrlKeys.modify(await c.req.json());
    })
);

export default app;
