import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/groups";
import { JoinGroupForm } from "./JoinGroupForm";

export default async function JoinGroupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const membership = await getMembership(user.id);
  if (membership) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Unite a tu grupo</h1>
          <p className="mt-1 text-sm text-gray-600">
            Pedile el código de invitación a tu profesor.
          </p>
        </div>
        <JoinGroupForm />
      </div>
    </div>
  );
}
