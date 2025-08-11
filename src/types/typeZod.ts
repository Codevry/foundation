import type { ZodObject } from "zod";
import { ZodEffects } from "zod/v3";

export type TypeZodSchema = {
    body?: ZodObject<any>;
    headers?: ZodObject<any>;
    params?: ZodObject<any>;
    query?: ZodObject<any>;
};
