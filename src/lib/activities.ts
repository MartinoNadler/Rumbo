import "server-only";
import { prisma } from "@/lib/prisma";
import { ActivitySource, type Prisma } from "@prisma/client";

export type ActivityFilters = {
  from?: string;
  to?: string;
  type?: string;
  source?: string;
};

function isActivitySource(value: string): value is ActivitySource {
  return (Object.values(ActivitySource) as string[]).includes(value);
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildWhere(userId: string, filters: ActivityFilters) {
  const where: Prisma.ActivityWhereInput = { userId };

  if (filters.from || filters.to) {
    where.startDate = {};
    if (filters.from) where.startDate.gte = new Date(filters.from);
    if (filters.to) {
      const to = new Date(filters.to);
      to.setHours(23, 59, 59, 999);
      where.startDate.lte = to;
    }
  }

  if (filters.type) where.type = filters.type;
  if (filters.source && isActivitySource(filters.source)) where.source = filters.source;

  return where;
}

export async function getActivities(userId: string, filters: ActivityFilters = {}) {
  return prisma.activity.findMany({
    where: buildWhere(userId, filters),
    orderBy: { startDate: "desc" },
  });
}

export async function getActivityTypes(userId: string) {
  const rows = await prisma.activity.findMany({
    where: { userId },
    select: { type: true },
    distinct: ["type"],
  });
  return rows.map((r) => r.type).sort();
}

export async function getWeeklyVolume(userId: string, weeks = 10) {
  const since = startOfWeek(new Date());
  since.setDate(since.getDate() - (weeks - 1) * 7);

  const activities = await prisma.activity.findMany({
    where: { userId, startDate: { gte: since } },
    select: { startDate: true, distanceMeters: true },
  });

  const buckets = new Map<string, { km: number; count: number }>();
  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(since);
    weekStart.setDate(since.getDate() + i * 7);
    buckets.set(weekStart.toISOString().slice(0, 10), { km: 0, count: 0 });
  }

  for (const activity of activities) {
    const key = startOfWeek(activity.startDate).toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.km += activity.distanceMeters / 1000;
      bucket.count += 1;
    }
  }

  return Array.from(buckets.entries()).map(([weekStart, data]) => ({
    weekStart,
    km: Number(data.km.toFixed(1)),
    count: data.count,
  }));
}

export async function getDashboardSummary(userId: string) {
  const weekStart = startOfWeek(new Date());

  const [thisWeekActivities, last4WeeksActivities, lastActivity] = await Promise.all([
    prisma.activity.findMany({
      where: { userId, startDate: { gte: weekStart } },
      select: { distanceMeters: true },
    }),
    prisma.activity.findMany({
      where: {
        userId,
        startDate: { gte: new Date(weekStart.getTime() - 27 * 24 * 60 * 60 * 1000) },
      },
      select: { avgPaceSecPerKm: true },
    }),
    prisma.activity.findFirst({
      where: { userId },
      orderBy: { startDate: "desc" },
    }),
  ]);

  const kmThisWeek = thisWeekActivities.reduce((sum, a) => sum + a.distanceMeters / 1000, 0);
  const paces = last4WeeksActivities
    .map((a) => a.avgPaceSecPerKm)
    .filter((p): p is number => p != null);
  const avgPaceLast4Weeks =
    paces.length > 0 ? paces.reduce((sum, p) => sum + p, 0) / paces.length : null;

  return {
    kmThisWeek: Number(kmThisWeek.toFixed(1)),
    activitiesThisWeek: thisWeekActivities.length,
    avgPaceLast4Weeks,
    lastActivity,
  };
}
