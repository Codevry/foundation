import { Hono } from "hono";
import middlewareKey from "@/src/middleware/middlewareKey.ts";
import middlewareLimiter from "@/src/middleware/middlewareLimiter.ts";

const app = new Hono();

/**
 * create query string from hono records
 * @param query
 */
function queryString(query: Record<string, string>) {
    const searchParams = new URLSearchParams(query);
    return searchParams.toString();
}

// open routes
app.all("/open/*", async (c) => {
    const url =
        Bun.env.REDIRECT_URL_OPEN +
        c.req.path.replace("/route/open", "") +
        queryString(c.req.query());
    return await fetch(url, c.req.raw);
});

// secure routes
app.all("/secure/*", middlewareKey(), middlewareLimiter, async (c) => {
    const url =
        Bun.env.REDIRECT_URL_SECURE +
        c.req.path.replace("/route/secure", "") +
        queryString(c.req.query());
    return await fetch(url, c.req.raw);
});

export default app;
