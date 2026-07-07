import type { ActivitySource } from "@prisma/client";

/**
 * Common shape every importer (manual form, CSV, GPX, TCX, FIT, and later
 * Strava) must normalize its input into before it reaches the database.
 * Keeping this stable is what lets a new source be added as a new adapter
 * instead of new branching logic throughout the app.
 */
export type NormalizedActivity = {
  source: ActivitySource;
  externalId?: string | null;
  type: string;
  startDate: Date;
  distanceMeters: number;
  movingTimeSec: number;
  elapsedTimeSec: number;
  avgPaceSecPerKm?: number | null;
  avgHeartRate?: number | null;
  maxHeartRate?: number | null;
  avgCadence?: number | null;
  elevationGainMeters?: number | null;
  calories?: number | null;
  splits?: unknown;
  gpsTrack?: unknown;
  feeling?: string | null;
  notes?: string | null;
};
