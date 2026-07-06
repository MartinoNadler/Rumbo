import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Hola, {dbUser?.name ?? user.email}
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

        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
          Todavía no conectaste tu cuenta de Strava. El dashboard de
          entrenamientos va a aparecer acá una vez que sincronices tus
          actividades.
        </div>
      </div>
    </div>
  );
}
