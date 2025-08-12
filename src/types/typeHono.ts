import type { TypeKey } from "@/src/types/typeKey.ts";
declare module "hono" {
    interface ContextVariableMap {
        apiKeyData: TypeKey;
    }
}
