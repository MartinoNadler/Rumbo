import Link from "next/link";
import type { ActivityFilters } from "@/lib/activities";

const SOURCE_LABELS: Record<string, string> = {
  STRAVA: "Strava",
  MANUAL: "Manual",
};

export function ActivityFiltersForm({
  basePath,
  types,
  filters,
}: {
  basePath: string;
  types: string[];
  filters: ActivityFilters;
}) {
  const hasFilters = Boolean(filters.from || filters.to || filters.type || filters.source);

  return (
    <form method="get" action={basePath} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="from" className="block text-xs font-medium text-gray-600">
          Desde
        </label>
        <input
          id="from"
          name="from"
          type="date"
          defaultValue={filters.from ?? ""}
          className="mt-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="to" className="block text-xs font-medium text-gray-600">
          Hasta
        </label>
        <input
          id="to"
          name="to"
          type="date"
          defaultValue={filters.to ?? ""}
          className="mt-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-xs font-medium text-gray-600">
          Deporte
        </label>
        <select
          id="type"
          name="type"
          defaultValue={filters.type ?? ""}
          className="mt-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">Todos</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="source" className="block text-xs font-medium text-gray-600">
          Origen
        </label>
        <select
          id="source"
          name="source"
          defaultValue={filters.source ?? ""}
          className="mt-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">Todos</option>
          {Object.entries(SOURCE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
      >
        Aplicar
      </button>

      {hasFilters && (
        <Link href={basePath} className="text-sm text-gray-500 underline">
          Limpiar filtros
        </Link>
      )}
    </form>
  );
}
