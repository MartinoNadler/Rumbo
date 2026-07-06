import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getGroupOwnedBy } from "@/lib/groups";
import { NewGroupForm } from "./NewGroupForm";

export default async function NewGroupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (dbUser?.role !== "PROFESSOR") {
    redirect("/dashboard");
  }

  const existing = await getGroupOwnedBy(user.id);
  if (existing) {
    redirect("/group");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Creá tu grupo</h1>
          <p className="mt-1 text-sm text-gray-600">
            Vas a recibir un código de invitación para compartir con tus alumnos.
          </p>
        </div>
        <NewGroupForm />
      </div>
    </div>
  );
}
