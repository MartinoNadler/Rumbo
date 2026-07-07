"use client";

import { useActionState } from "react";
import { joinGroupAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JoinGroupForm() {
  const [state, formAction, isPending] = useActionState(joinGroupAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          name="inviteCode"
          placeholder="Código de invitación"
          required
          className="max-w-40 font-mono uppercase"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uniendo..." : "Unirme"}
        </Button>
      </div>
      {state?.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
