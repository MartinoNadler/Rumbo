import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { getGroupDetailForProfessor } from "@/lib/groups/list";
import { formatDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { removeMemberAction } from "./actions";
import { AssignWorkoutForm } from "./assign-workout-form";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  const { id } = await params;
  const group = await getGroupDetailForProfessor(user, id);
  if (!group) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/grupos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Grupos
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{group.name}</h1>
        <p className="text-muted-foreground">
          Código de invitación: <span className="font-mono">{group.inviteCode}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Alumnos ({group.memberships.length})
        </h2>
        {group.memberships.length === 0 ? (
          <Card>
            <CardContent className="text-center text-sm text-muted-foreground">
              Todavía no se unió ningún alumno. Compartí el código de invitación.
            </CardContent>
          </Card>
        ) : (
          group.memberships.map((membership) => (
            <Card key={membership.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{membership.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {membership.user.email} · se unió el {formatDate(membership.joinedAt)}
                  </p>
                </div>
                <form action={removeMemberAction.bind(null, group.id, membership.id)}>
                  <button
                    type="submit"
                    aria-label="Quitar alumno"
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {group.memberships.length > 0 && (
        <AssignWorkoutForm
          groupId={group.id}
          students={group.memberships.map((m) => ({
            membershipId: m.id,
            userId: m.user.id,
            name: m.user.name,
          }))}
        />
      )}
    </div>
  );
}
