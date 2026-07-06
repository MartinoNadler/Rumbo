"use client";

import { useActionState } from "react";
import { createGroupAction } from "./actions";

export function NewGroupForm() {
  const [state, formAction, pending] = useActionState(createGroupAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del grupo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ej: Running Club Martes y Jueves"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "Creando..." : "Crear grupo"}
      </button>
    </form>
  );
}
