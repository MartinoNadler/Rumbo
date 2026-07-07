"use client";

import { useActionState } from "react";
import { importActivityFile } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function ImportActivityForm() {
  const [state, formAction, isPending] = useActionState(importActivityFile, undefined);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file">Archivo</Label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".gpx"
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-background"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Importando..." : "Importar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
