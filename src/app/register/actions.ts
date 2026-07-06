"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export type RegisterState = { error?: string; message?: string } | undefined;

export async function register(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password) {
    return { error: "Completá todos los campos." };
  }

  if (role !== "PROFESSOR" && role !== "STUDENT") {
    return { error: "Elegí si sos profesor o alumno." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "No se pudo crear la cuenta. Intentá de nuevo." };
  }

  await prisma.user.create({
    data: { id: data.user.id, email, name, role: role as Role },
  });

  if (!data.session) {
    return { message: "Te enviamos un email para confirmar tu cuenta." };
  }

  redirect("/dashboard");
}
