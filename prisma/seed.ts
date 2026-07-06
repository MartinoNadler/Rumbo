import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function randFloat(min: number, max: number, decimals = 1) {
  const value = min + Math.random() * (max - min);
  return Number(value.toFixed(decimals));
}

function buildSplits(distanceMeters: number, avgPaceSecPerKm: number, avgHeartRate: number) {
  const km = Math.floor(distanceMeters / 1000);
  return Array.from({ length: Math.max(km, 1) }, (_, i) => ({
    km: i + 1,
    paceSecPerKm: Math.round(avgPaceSecPerKm + randInt(-15, 15)),
    heartRate: Math.round(avgHeartRate + randInt(-8, 8)),
  }));
}

async function seedUser(userId: string) {
  const weeks = 10;
  const activities: Array<Parameters<typeof prisma.activity.create>[0]["data"]> = [];

  for (let week = weeks - 1; week >= 0; week--) {
    const runsThisWeek = randInt(3, 5);

    for (let run = 0; run < runsThisWeek; run++) {
      const daysAgo = week * 7 + randInt(0, 6);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      startDate.setHours(randInt(6, 20), randInt(0, 59), 0, 0);

      const distanceMeters = randInt(3000, 14000);
      // Ritmo mejora levemente semana a semana (mas reciente = mas rapido)
      const basePace = 360 - (weeks - week) * 3;
      const avgPaceSecPerKm = randInt(basePace - 15, basePace + 20);
      const movingTimeSec = Math.round((distanceMeters / 1000) * avgPaceSecPerKm);
      const avgHeartRate = randInt(142, 168);

      activities.push({
        userId,
        source: "STRAVA",
        externalId: `seed-${userId}-${week}-${run}`,
        type: "Run",
        startDate,
        distanceMeters,
        movingTimeSec,
        elapsedTimeSec: movingTimeSec + randInt(0, 60),
        avgPaceSecPerKm,
        avgHeartRate,
        maxHeartRate: avgHeartRate + randInt(10, 25),
        avgCadence: randFloat(165, 182, 0),
        elevationGainMeters: randFloat(5, 140, 0),
        calories: Math.round((distanceMeters / 1000) * 65),
        splits: buildSplits(distanceMeters, avgPaceSecPerKm, avgHeartRate),
      });
    }
  }

  for (const data of activities) {
    await prisma.activity.upsert({
      where: {
        userId_source_externalId: {
          userId: data.userId as string,
          source: data.source as "STRAVA",
          externalId: data.externalId as string,
        },
      },
      update: {},
      create: data,
    });
  }

  return activities.length;
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });

  if (users.length === 0) {
    console.log("No hay usuarios todavia. Registrate en /register y volve a correr el seed.");
    return;
  }

  for (const user of users) {
    const count = await seedUser(user.id);
    console.log(`Seed OK para ${user.email}: ${count} actividades`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
