"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { createActivity } from "@/lib/activities/create";
import { parseActivityFile } from "@/lib/activities/parsers";

export type ImportActivityState = { error?: string } | undefined;

export async function importActivityFile(
  _prevState: ImportActivityState,
  formData: FormData
): Promise<ImportActivityState> {
  const user = await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Elegí un archivo para importar." };
  }

  let contents: string;
  try {
    contents = await file.text();
  } catch {
    return { error: "No se pudo leer el archivo." };
  }

  try {
    const activity = parseActivityFile(file.name, contents);
    await createActivity(user, activity);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "Ya importaste esta actividad antes." };
    }
    return { error: err instanceof Error ? err.message : "No se pudo importar el archivo." };
  }

  redirect("/hoy");
}
