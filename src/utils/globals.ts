import type { DbRedis } from "@/src/services/dbRedis.ts";
import type Admin from "@/src/services/admin.ts";
import CtrlKeys from "@/src/controller/ctrlKeys.ts";

export default class Globals {
    static dbRedis: DbRedis;
    static admin: Admin;
    static ctrlKeys = new CtrlKeys();
}
