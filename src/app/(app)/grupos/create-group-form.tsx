"use client";

import { useActionState } from "react";
import { createGroupAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateGroupForm() {
  const [state, formAction, isPending] = useActionState(createGroupAction, undefined);

  return (
    <form action={formAction} className="flex gap-2">
      <Input name="name" placeholder="Nombre del grupo" required className="max-w-xs" />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creando..." : "Crear grupo"}
      </Button>
      {state?.error && (
        <p className="self-center text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
