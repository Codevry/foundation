import type { DbRedis } from "@/src/services/dbRedis.ts";
import type Admin from "@/src/services/admin.ts";

export default class Globals {
    static dbRedis: DbRedis;
    static admin: Admin;
}
