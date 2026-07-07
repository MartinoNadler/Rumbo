import { z } from "zod";
import type { NormalizedActivity } from "@/lib/activities/types";

export const ACTIVITY_TYPES = [
  "Running",
  "Trail Running",
  "Ciclismo",
  "Caminata",
  "Otro",
] as const;

export const FEELINGS = ["GREAT", "GOOD", "OK", "BAD"] as const;

const numberField = (opts: { positive?: boolean } = {}) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    opts.positive
      ? z.coerce.number().positive().optional()
      : z.coerce.number().nonnegative().optional()
  );

export const manualActivitySchema = z.object({
  type: z.enum(ACTIVITY_TYPES),
  startDate: z.string().min(1, "Elegí una fecha"),
  distanceKm: z.coerce.number().positive("Ingresá una distancia mayor a 0"),
  durationMin: z.coerce.number().positive("Ingresá una duración mayor a 0"),
  movingMin: numberField({ positive: true }),
  avgHeartRate: numberField({ positive: true }),
  maxHeartRate: numberField({ positive: true }),
  avgCadence: numberField({ positive: true }),
  elevationGainMeters: numberField(),
  calories: numberField({ positive: true }),
  feeling: z.enum(FEELINGS).optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});

export type ManualActivityInput = z.infer<typeof manualActivitySchema>;

export function toNormalizedActivity(input: ManualActivityInput): NormalizedActivity {
  const elapsedTimeSec = Math.round(input.durationMin * 60);
  const movingTimeSec = input.movingMin ? Math.round(input.movingMin * 60) : elapsedTimeSec;
  const avgPaceSecPerKm = elapsedTimeSec / input.distanceKm;

  return {
    source: "MANUAL",
    type: input.type,
    startDate: new Date(input.startDate),
    distanceMeters: input.distanceKm * 1000,
    movingTimeSec,
    elapsedTimeSec,
    avgPaceSecPerKm,
    avgHeartRate: input.avgHeartRate ?? null,
    maxHeartRate: input.maxHeartRate ?? null,
    avgCadence: input.avgCadence ?? null,
    elevationGainMeters: input.elevationGainMeters ?? null,
    calories: input.calories ?? null,
    feeling: input.feeling || null,
    notes: input.notes || null,
  };
}
