"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createActivity } from "@/lib/activities/create";
import { manualActivitySchema, toNormalizedActivity } from "@/lib/activities/manual-schema";

export type CreateActivityState = { error?: string } | undefined;

export async function createManualActivity(
  _prevState: CreateActivityState,
  formData: FormData
): Promise<CreateActivityState> {
  const user = await requireUser();

  const parsed = manualActivitySchema.safeParse({
    type: formData.get("type"),
    startDate: formData.get("startDate"),
    distanceKm: formData.get("distanceKm"),
    durationMin: formData.get("durationMin"),
    movingMin: formData.get("movingMin"),
    avgHeartRate: formData.get("avgHeartRate"),
    maxHeartRate: formData.get("maxHeartRate"),
    avgCadence: formData.get("avgCadence"),
    elevationGainMeters: formData.get("elevationGainMeters"),
    calories: formData.get("calories"),
    feeling: formData.get("feeling"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisá los datos ingresados." };
  }

  await createActivity(user, toNormalizedActivity(parsed.data));

  redirect("/hoy");
}
