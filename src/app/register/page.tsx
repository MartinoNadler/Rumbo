"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { GraduationCap, Users } from "lucide-react";
import { register } from "./actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, undefined);
  const [role, setRole] = useState<"STUDENT" | "PROFESSOR">("STUDENT");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Sumate como alumno o como profesor.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="role" value={role} />

            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                label="Alumno"
                icon={<GraduationCap className="size-5" />}
                selected={role === "STUDENT"}
                onClick={() => setRole("STUDENT")}
              />
              <RoleOption
                label="Profesor"
                icon={<Users className="size-5" />}
                selected={role === "PROFESSOR"}
                onClick={() => setRole("PROFESSOR")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500" role="alert">
                {state.error}
              </p>
            )}
            {state?.message && (
              <p className="text-sm text-emerald-600" role="status">
                {state.message}
              </p>
            )}

            <Button type="submit" disabled={isPending} className="mt-2">
              {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-medium text-foreground underline">
              Iniciá sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function RoleOption({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-transparent text-foreground hover:bg-muted"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
