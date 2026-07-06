import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";
import {
  getActivities,
  getActivityTypes,
  getDashboardSummary,
  getWeeklyVolume,
  type ActivityFilters,
} from "@/lib/activities";
import { formatDate, formatKm, formatPace } from "@/lib/format";
import { WeeklyVolumeChart } from "@/components/WeeklyVolumeChart";
import { ActivityFiltersForm } from "@/components/ActivityFiltersForm";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const filters: ActivityFilters = {
    from: typeof params.from === "string" ? params.from : undefined,
    to: typeof params.to === "string" ? params.to : undefined,
    type: typeof params.type === "string" ? params.type : undefined,
    source: typeof params.source === "string" ? params.source : undefined,
  };

  const [dbUser, summary, weeklyVolume, activityTypes, activities] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    getDashboardSummary(user.id),
    getWeeklyVolume(user.id),
    getActivityTypes(user.id),
    getActivities(user.id, filters),
  ]);

  const hasFilters = Boolean(filters.from || filters.to || filters.type || filters.source);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Hola, {dbUser?.name ?? user.email}
          </h1>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Esta semana" value={`${summary.kmThisWeek} km`} />
          <StatTile
            label="Actividades esta semana"
            value={String(summary.activitiesThisWeek)}
          />
          <StatTile
            label="Ritmo prom. (4 semanas)"
            value={formatPace(summary.avgPaceLast4Weeks)}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-medium text-gray-700">
            Volumen semanal (últimas 10 semanas)
          </h2>
          <WeeklyVolumeChart data={weeklyVolume} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-gray-700">Filtros</h2>
          <ActivityFiltersForm
            basePath="/dashboard"
            types={activityTypes}
            filters={filters}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-sm font-medium text-gray-700">
              {hasFilters ? "Actividades filtradas" : "Últimas actividades"}
            </h2>
            <span className="text-xs text-gray-500">{activities.length} resultados</span>
          </div>

          {activities.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              No hay actividades que coincidan con estos filtros.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id}>
                  <Link
                    href={`/activities/${activity.id}`}
                    className="flex items-center justify-between p-4 text-sm hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{activity.type}</div>
                      <div className="text-gray-500">
                        {formatDate(activity.startDate)}
                      </div>
                    </div>
                    <div className="text-right text-gray-700">
                      <div>{formatKm(activity.distanceMeters)}</div>
                      <div className="text-gray-500">
                        {formatPace(activity.avgPaceSecPerKm)}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}
