import { DbRedis } from "@/src/services/dbRedis.ts";
import Globals from "@/src/utils/globals.ts";
import Admin from "@/src/services/admin.ts";
import routeKeys from "@/src/routes/routeKeys.ts";
import { Hono } from "hono";
import { logger } from "hono/logger";
import routeRedirect from "@/src/routes/routeRedirect.ts";
import { MiddlewareUnhandled } from "@/src/middleware/middlewareUnhandled.ts";

// initializers
Globals.dbRedis = new DbRedis();
Globals.admin = new Admin();

// connect to redis
await Globals.dbRedis.connect().catch((err) => {
    console.error(err);
    process.exit(1);
});

console.log("connected to redis");

// generate api key
const key = await Globals.admin.generateKey();
console.log(key);

// apply routes
const app = new Hono();

app.use(logger());
app.use(MiddlewareUnhandled());

app.route("/admin/keys", routeKeys);
app.route("/route", routeRedirect);

export default {
    port: 3131,
    fetch: app.fetch,
};
