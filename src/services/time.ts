import {
    endOfHour,
    endOfDay,
    endOfWeek,
    endOfMonth,
    endOfYear,
} from "date-fns";
import { EnumPeriod } from "@/src/utils/enums.ts";

export default class Time {
    /**
     * calculate ttl for redis
     * @param period
     * @param ttl
     */
    static calculateRedisTTL(period: EnumPeriod, ttl?: number): number {
        const now = new Date();
        const weekStartsOnSunday = !!Bun.env.WEEK_STARTS_ON_SUNDAY;
        let endOfPeriod;

        switch (period) {
            case EnumPeriod.hourly:
                endOfPeriod = endOfHour(now);
                break;
            case EnumPeriod.daily:
                endOfPeriod = endOfDay(now);
                break;
            case EnumPeriod.weekly:
                // week start on Monday
                endOfPeriod = endOfWeek(now, {
                    weekStartsOn: weekStartsOnSunday ? 0 : 1,
                });
                break;
            case EnumPeriod.monthly:
                endOfPeriod = endOfMonth(now);
                break;
            case EnumPeriod.yearly:
                endOfPeriod = endOfYear(now);
                break;
            case EnumPeriod.custom:
                // The custom TTL is already in seconds, so we just return it.
                return ttl || 1;
            default:
                // Fallback for an invalid period, returning a default TTL or throwing an error.
                console.error("Invalid period provided.");
                return 1;
        }

        // Calculate the difference in milliseconds between the end of the period and now.
        const timeRemainingInMilliseconds =
            endOfPeriod.getTime() - now.getTime();

        // Convert milliseconds to seconds and round up to ensure the TTL doesn't expire too early.
        return Math.ceil(timeRemainingInMilliseconds / 1000);
    }
}
