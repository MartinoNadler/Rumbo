import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDuration, formatKm, formatPace } from "@/lib/format";
import { SplitsCharts } from "@/components/SplitsCharts";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const activity = await prisma.activity.findUnique({ where: { id } });

  if (!activity || activity.userId !== user.id) {
    notFound();
  }

  const splits = Array.isArray(activity.splits)
    ? (activity.splits as Array<{ km: number; paceSecPerKm: number; heartRate: number }>)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/dashboard" className="text-sm text-gray-500 underline">
            &larr; Volver al dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">{activity.type}</h1>
          <p className="text-sm text-gray-500">{formatDate(activity.startDate)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Distancia" value={formatKm(activity.distanceMeters)} />
          <Stat label="Duración" value={formatDuration(activity.elapsedTimeSec)} />
          <Stat
            label="Tiempo en movimiento"
            value={formatDuration(activity.movingTimeSec)}
          />
          <Stat label="Ritmo promedio" value={formatPace(activity.avgPaceSecPerKm)} />
          <Stat
            label="FC promedio"
            value={activity.avgHeartRate ? `${Math.round(activity.avgHeartRate)} bpm` : "-"}
          />
          <Stat
            label="FC máxima"
            value={activity.maxHeartRate ? `${Math.round(activity.maxHeartRate)} bpm` : "-"}
          />
          <Stat
            label="Cadencia prom."
            value={activity.avgCadence ? `${Math.round(activity.avgCadence)} spm` : "-"}
          />
          <Stat
            label="Desnivel positivo"
            value={
              activity.elevationGainMeters != null
                ? `${Math.round(activity.elevationGainMeters)} m`
                : "-"
            }
          />
          <Stat
            label="Calorías"
            value={activity.calories != null ? `${Math.round(activity.calories)} kcal` : "-"}
          />
          <Stat label="Origen" value={activity.source} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          {splits.length > 0 ? (
            <SplitsCharts splits={splits} />
          ) : (
            <p className="text-sm text-gray-500">
              Esta actividad no tiene splits disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
