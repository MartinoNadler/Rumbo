import Link from "next/link";
import { Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { getGroupsForProfessor } from "@/lib/groups/list";
import { Card, CardContent } from "@/components/ui/card";
import { CreateGroupForm } from "./create-group-form";

export default async function GruposPage() {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  const groups = await getGroupsForProfessor(user);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Grupos</h1>
        <p className="text-muted-foreground">Administrá tus grupos y alumnos.</p>
      </div>

      <CreateGroupForm />

      <div className="flex flex-col gap-3">
        {groups.length === 0 ? (
          <Card>
            <CardContent className="text-center text-sm text-muted-foreground">
              Todavía no creaste ningún grupo.
            </CardContent>
          </Card>
        ) : (
          groups.map((group) => (
            <Link key={group.id} href={`/grupos/${group.id}`}>
              <Card className="transition-colors hover:bg-muted">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Código: <span className="font-mono">{group.inviteCode}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    {group.memberships.length}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
