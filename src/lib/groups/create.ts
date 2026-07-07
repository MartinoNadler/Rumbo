import { Prisma } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";
import { generateInviteCode } from "@/lib/groups/invite-code";

const MAX_ATTEMPTS = 5;

export async function createGroup(professor: CurrentUser, name: string) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await withUserContext(professor.id, professor.role, (tx) =>
        tx.group.create({
          data: { name, inviteCode: generateInviteCode(), professorId: professor.id },
        })
      );
    } catch (err) {
      const isInviteCodeCollision =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        (err.meta?.target as string[] | undefined)?.includes("inviteCode");
      if (!isInviteCodeCollision) throw err;
    }
  }
  throw new Error("No se pudo generar un código de invitación único. Probá de nuevo.");
}
