import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";
import { getGroupOwnedBy, getRoster } from "@/lib/groups";
import { formatDate } from "@/lib/format";

export default async function GroupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "PROFESSOR") {
    redirect("/dashboard");
  }

  const group = await getGroupOwnedBy(user.id);
  if (!group) {
    redirect("/groups/new");
  }

  const roster = await getRoster(group.id);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Hola, {dbUser?.nickname ?? dbUser?.name}
          </h1>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-700">{group.name}</h2>
              <p className="text-xs text-gray-500">Código de invitación</p>
            </div>
            <span className="rounded-md bg-gray-100 px-3 py-1.5 font-mono text-lg tracking-widest text-gray-900">
              {group.inviteCode}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-sm font-medium text-gray-700">Alumnos</h2>
            <span className="text-xs text-gray-500">{roster.length} en el grupo</span>
          </div>

          {roster.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              Todavía no se unió ningún alumno. Compartí el código de invitación.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {roster.map((member) => (
                <li key={member.membershipId} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-gray-500">
                      Strava: {member.stravaConnected ? "conectado" : "sin conectar"}
                    </div>
                  </div>
                  <div className="text-right text-gray-700">
                    {member.sharesMetrics ? (
                      <div>
                        {member.lastActivityAt
                          ? `Última actividad: ${formatDate(member.lastActivityAt)}`
                          : "Sin actividades"}
                      </div>
                    ) : (
                      <div className="text-gray-400">No comparte métricas</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
