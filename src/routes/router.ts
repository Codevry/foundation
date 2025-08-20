import { Hono } from "hono";
import Globals from "@/src/utils/globals.ts";
import { DbRedis } from "@/src/services/dbRedis.ts";
import Admin from "@/src/services/admin.ts";
import { logger } from "hono/logger";
import { MiddlewareUnhandled } from "@/src/middleware/middlewareUnhandled.ts";
import routeKeys from "@/src/routes/routeKeys.ts";
import routeRedirect from "@/src/routes/routeRedirect.ts";
import { version } from "@/package.json";

export default class Router {
    private readonly app: Hono;

    constructor() {
        this.app = new Hono();
    }

    /**
     * setup middlewares
     * @private
     */
    private middlewares() {
        this.app.use(logger());
        this.app.use(MiddlewareUnhandled());
    }

    /**
     * setup routes
     */
    private routes() {
        // ping route
        this.app.on(["GET", "POST"], ["/", "/ping", "/health"], (c) =>
            c.json({ success: true, message: "server is working", version })
        );

        // app routes
        this.app.route("/admin/keys", routeKeys);
        this.app.route("/route", routeRedirect);

        // 404
        this.app.all("*", (c) => {
            c.status(404);
            return c.json({
                success: false,
                message: `route not found ${c.req.path}`,
            });
        });
    }

    /**
     * connect to database & services
     * @private
     */
    private async database() {
        Globals.dbRedis = new DbRedis();
        await Globals.dbRedis
            .connect()
            .then(() => console.log("connected to redis"))
            .catch((err) => {
                console.error(err);
                process.exit(1);
            });
    }

    /**
     * generate admin key
     * @private
     */
    private async admin() {
        Globals.admin = new Admin();
        const key = await Globals.admin.generateKey();
        console.log(`Admin Key: ${key}`);
    }

    /**
     * setup & return
     */
    async connect() {
        await this.database();
        await this.admin();
        this.middlewares();
        this.routes();
        return this.app;
    }
}
