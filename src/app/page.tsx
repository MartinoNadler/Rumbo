import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_ROUTE } from "@/components/nav/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect(DEFAULT_ROUTE[user.role]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <h1 className="max-w-md text-3xl font-semibold tracking-tight text-balance">
        Organizá tu entrenamiento, tu grupo y tu progreso en un solo lugar.
      </h1>
      <p className="max-w-sm text-muted-foreground">
        Planificación, estadísticas y comunidad para alumnos y profesores de running.
      </p>
      <div className="flex gap-3">
        <Link href="/register" className={cn(buttonVariants())}>
          Crear cuenta
        </Link>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}
