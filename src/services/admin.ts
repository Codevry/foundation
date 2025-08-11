import Globals from "@/src/utils/globals.ts";

export default class Admin {
    /**
     * generate a new admin key
     */
    async generateKey() {
        const existing = await Globals.dbRedis.get("admin:key");
        if (existing) return existing;
        else {
            await Globals.dbRedis.create("admin:key", crypto.randomUUID());
            return await Globals.dbRedis.get("admin:key");
        }
    }
}
