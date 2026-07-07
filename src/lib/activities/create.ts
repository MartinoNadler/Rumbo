import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";
import type { NormalizedActivity } from "@/lib/activities/types";

export async function createActivity(user: CurrentUser, activity: NormalizedActivity) {
  return withUserContext(user.id, user.role, (tx) =>
    tx.activity.create({
      data: {
        userId: user.id,
        source: activity.source,
        externalId: activity.externalId ?? null,
        type: activity.type,
        startDate: activity.startDate,
        distanceMeters: activity.distanceMeters,
        movingTimeSec: activity.movingTimeSec,
        elapsedTimeSec: activity.elapsedTimeSec,
        avgPaceSecPerKm: activity.avgPaceSecPerKm ?? null,
        avgHeartRate: activity.avgHeartRate ?? null,
        maxHeartRate: activity.maxHeartRate ?? null,
        avgCadence: activity.avgCadence ?? null,
        elevationGainMeters: activity.elevationGainMeters ?? null,
        calories: activity.calories ?? null,
        splits: activity.splits ?? undefined,
        gpsTrack: activity.gpsTrack ?? undefined,
        feeling: activity.feeling ?? null,
        notes: activity.notes ?? null,
      },
    })
  );
}
