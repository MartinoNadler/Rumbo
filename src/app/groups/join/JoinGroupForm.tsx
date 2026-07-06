"use client";

import { useActionState } from "react";
import { joinGroupAction } from "./actions";

export function JoinGroupForm() {
  const [state, formAction, pending] = useActionState(joinGroupAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Código de invitación
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          placeholder="Ej: A3F9K2"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase tracking-widest focus:border-gray-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "Uniéndote..." : "Unirme al grupo"}
      </button>
    </form>
  );
}
