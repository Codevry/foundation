import type { EnumPeriod } from "@/src/utils/enums.ts";

export type TypeKey = {
    key: string;
    limit: number;
    period: EnumPeriod;
    customPeriod?: number;
};

export type TypeKeyGenerated = {
    limit: number;
    period: EnumPeriod;
    customPeriod?: number;
};
