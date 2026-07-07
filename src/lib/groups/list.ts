import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";

export async function getGroupsForProfessor(professor: CurrentUser) {
  return withUserContext(professor.id, professor.role, (tx) =>
    tx.group.findMany({
      where: { professorId: professor.id },
      include: { memberships: true },
      orderBy: { createdAt: "desc" },
    })
  );
}

export async function getGroupDetailForProfessor(professor: CurrentUser, groupId: string) {
  return withUserContext(professor.id, professor.role, (tx) =>
    tx.group.findFirst({
      where: { id: groupId, professorId: professor.id },
      include: { memberships: { include: { user: true }, orderBy: { joinedAt: "asc" } } },
    })
  );
}

export async function getMembershipForStudent(student: CurrentUser) {
  return withUserContext(student.id, student.role, (tx) =>
    tx.membership.findUnique({
      where: { userId: student.id },
      include: {
        group: {
          include: {
            professor: true,
            memberships: { include: { user: true }, orderBy: { joinedAt: "asc" } },
          },
        },
      },
    })
  );
}
