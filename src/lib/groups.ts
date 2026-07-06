import "server-only";
import { prisma } from "@/lib/prisma";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I para evitar confusion

function generateCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export async function createGroup(professorId: string, name: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const inviteCode = generateCode();
    try {
      return await prisma.group.create({
        data: { name, professorId, inviteCode },
      });
    } catch (err: unknown) {
      const isUniqueConflict =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "P2002";
      if (!isUniqueConflict) throw err;
    }
  }
  throw new Error("No se pudo generar un código de invitación único. Intentá de nuevo.");
}

export async function getGroupOwnedBy(professorId: string) {
  return prisma.group.findFirst({ where: { professorId } });
}

export async function getMembership(userId: string) {
  return prisma.membership.findUnique({
    where: { userId },
    include: { group: true },
  });
}

export type JoinGroupResult =
  | { ok: true }
  | { ok: false; error: string };

export async function joinGroupByCode(userId: string, rawCode: string): Promise<JoinGroupResult> {
  const inviteCode = rawCode.trim().toUpperCase();

  if (!inviteCode) {
    return { ok: false, error: "Ingresá un código de invitación." };
  }

  const existing = await prisma.membership.findUnique({ where: { userId } });
  if (existing) {
    return { ok: false, error: "Ya pertenecés a un grupo." };
  }

  const group = await prisma.group.findUnique({ where: { inviteCode } });
  if (!group) {
    return { ok: false, error: "No encontramos un grupo con ese código." };
  }

  await prisma.membership.create({
    data: { userId, groupId: group.id },
  });

  return { ok: true };
}

export async function getRoster(groupId: string) {
  const memberships = await prisma.membership.findMany({
    where: { groupId },
    include: {
      user: {
        include: {
          stravaAccount: true,
          activities: {
            orderBy: { startDate: "desc" },
            take: 1,
            select: { startDate: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  return memberships.map((m) => ({
    membershipId: m.id,
    userId: m.userId,
    name: m.user.nickname || m.user.name,
    stravaConnected: Boolean(m.user.stravaAccount),
    sharesMetrics: m.metricsSharedWithProfessor,
    lastActivityAt: m.metricsSharedWithProfessor
      ? m.user.activities[0]?.startDate ?? null
      : null,
    joinedAt: m.joinedAt,
  }));
}
