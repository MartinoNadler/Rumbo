"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WeekPoint = { weekStart: string; km: number; count: number };

function formatWeekLabel(weekStart: string) {
  const d = new Date(weekStart);
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" }).format(d);
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: WeekPoint }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-[#e1e0d9] bg-[#fcfcfb] px-3 py-2 text-sm shadow-sm">
      <div className="font-medium text-[#0b0b0b]">Semana del {formatWeekLabel(label ?? "")}</div>
      <div className="text-[#52514e]">{point.km} km &middot; {point.count} actividades</div>
    </div>
  );
}

export function WeeklyVolumeChart({ data }: { data: WeekPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e1e0d9" />
        <XAxis
          dataKey="weekStart"
          tickFormatter={formatWeekLabel}
          tick={{ fill: "#898781", fontSize: 12 }}
          axisLine={{ stroke: "#c3c2b7" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#898781", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#e1e0d9", opacity: 0.4 }} />
        <Bar dataKey="km" fill="#2a78d6" radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
