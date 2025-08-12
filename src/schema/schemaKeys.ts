import { z } from "zod";
import { EnumPeriod } from "@/src/utils/enums.ts";

export default {
    generate: {
        body: z
            .object({
                limit: z.number().min(1),
                period: z.enum(EnumPeriod),
                customPeriod: z.number().optional(),
            })
            .superRefine((data, ctx) => {
                if (
                    data.period === EnumPeriod.custom &&
                    data.customPeriod === undefined
                )
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message:
                            "customPeriod is required when period is set to custom",
                        path: ["customPeriod"], // Specify the field the error is related to
                    });
            }),
    },
    modify: {
        body: z
            .object({
                key: z.uuid(),
                limit: z.number().min(1),
                period: z.enum(EnumPeriod),
                customPeriod: z.number().optional(),
            })
            .superRefine((data, ctx) => {
                if (
                    data.period === EnumPeriod.custom &&
                    data.customPeriod === undefined
                )
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message:
                            "customPeriod is required when period is set to custom",
                        path: ["customPeriod"], // Specify the field the error is related to
                    });
            }),
    },
};
