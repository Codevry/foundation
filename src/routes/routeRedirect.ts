import { Hono } from "hono";

const app = new Hono();

// open routes
app.all("/open/*", async (c) => {
    const url = Bun.env.REDIRECT_OPEN + c.req.path + c.req.url.search;
    return await fetch(url, c.req.raw);
});

// secure routes
app.all("/secure/*", async (c) => {
    const url = Bun.env.REDIRECT_URL_SECURE + c.req.path + c.req.url.search;
    return await fetch(url, c.req.raw);
});

export default app;
