import { Prisma } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";

export async function joinGroupByCode(student: CurrentUser, rawCode: string) {
  const inviteCode = rawCode.trim().toUpperCase();

  return withUserContext(student.id, student.role, async (tx) => {
    const group = await tx.group.findUnique({ where: { inviteCode } });
    if (!group) throw new Error("Código de invitación inválido.");

    try {
      return await tx.membership.create({ data: { userId: student.id, groupId: group.id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Ya sos parte de un grupo. Salí de tu grupo actual antes de unirte a otro.");
      }
      throw err;
    }
  });
}

export async function leaveGroup(student: CurrentUser) {
  return withUserContext(student.id, student.role, (tx) =>
    tx.membership.delete({ where: { userId: student.id } })
  );
}

export async function removeMember(professor: CurrentUser, membershipId: string) {
  return withUserContext(professor.id, professor.role, (tx) =>
    tx.membership.delete({ where: { id: membershipId } })
  );
}
