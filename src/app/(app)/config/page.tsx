import { requireUser } from "@/lib/auth";
import { getMembershipForStudent } from "@/lib/groups/list";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JoinGroupForm } from "./join-group-form";
import { leaveGroupAction } from "./actions";

export default async function ConfigPage() {
  const user = await requireUser();
  const membership = user.role === "STUDENT" ? await getMembershipForStudent(user) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Config</h1>
        <p className="text-muted-foreground">Perfil, cuenta, hábitos, objetivos y privacidad.</p>
      </div>

      {user.role === "STUDENT" && (
        <Card>
          <CardHeader>
            <CardTitle>Mi grupo</CardTitle>
            <CardDescription>
              {membership ? "Estás anotado en un grupo." : "Todavía no te uniste a ningún grupo."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {membership ? (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-medium">{membership.group.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Profesor: {membership.group.professor.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Te uniste el {formatDate(membership.joinedAt)}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Compañeros ({membership.group.memberships.length})
                  </p>
                  <ul className="flex flex-col gap-1 text-sm">
                    {membership.group.memberships.map((m) => (
                      <li key={m.id}>{m.user.name}</li>
                    ))}
                  </ul>
                </div>
                <form action={leaveGroupAction}>
                  <Button type="submit" variant="outline" size="sm">
                    Salir del grupo
                  </Button>
                </form>
              </div>
            ) : (
              <JoinGroupForm />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
