/**
 * @info validate a schema in request
 */
import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { ZodError } from "zod";
import { jsonReformat } from "@/src/utils/functions.ts";
import type { TypeZodSchema } from "@/src/types/typeZod.ts";
import { fromError } from "zod-validation-error";

export function MiddlewareSchemaValidate(
    schema: TypeZodSchema
): MiddlewareHandler {
    return createMiddleware(async (c: Context, next: Next) => {
        const body =
            c.req.raw.headers.get("Content-Type") === "application/json"
                ? await c.req.json()
                : await c.req.parseBody();
        const headers = c.req.raw.headers.toJSON();
        const query = jsonReformat(c.req.query());
        const params = jsonReformat(c.req.param());

        // error handling
        let error: ZodError | undefined;

        // --- if the schema body is available to validate
        if (schema.body) error = schema.body.safeParse(body).error;

        // --- if schema headers is available to validate
        if (!error && schema.headers)
            error = schema.headers.safeParse(headers).error;

        // --- if schema query is available to validate
        if (!error && schema.query) error = schema.query.safeParse(query).error;

        // --- if schema params is available to validate
        if (!error && schema.params)
            error = schema.params.safeParse(params).error;

        // --- if an error exists, then return
        if (error) {
            c.status(400);
            return c.json({
                success: false,
                message: fromError(error).message,
            });
        }

        await next();
    });
}
