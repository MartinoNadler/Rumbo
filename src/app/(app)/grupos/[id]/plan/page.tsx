import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { getGroupDetailForProfessor } from "@/lib/groups/list";
import { PlanForm } from "./plan-form";

export default async function GroupPlanPage({
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
        <Link
          href={`/grupos/${group.id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {group.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Planificar</h1>
        <p className="text-muted-foreground">
          Armá una semana o un mes de entrenamientos de una sola vez.
        </p>
      </div>

      <PlanForm
        groupId={group.id}
        students={group.memberships.map((m) => ({ userId: m.user.id, name: m.user.name }))}
      />
    </div>
  );
}
