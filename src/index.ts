import { DbRedis } from "@/src/services/dbRedis.ts";
import Globals from "@/src/utils/globals.ts";
import Admin from "@/src/services/admin.ts";

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
