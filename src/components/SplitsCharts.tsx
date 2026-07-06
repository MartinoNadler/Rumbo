"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPace } from "@/lib/format";

type Split = { km: number; paceSecPerKm: number; heartRate: number };

function PaceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Split }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-[#e1e0d9] bg-[#fcfcfb] px-3 py-2 text-sm shadow-sm">
      <div className="font-medium text-[#0b0b0b]">Km {point.km}</div>
      <div className="text-[#52514e]">{formatPace(point.paceSecPerKm)}</div>
    </div>
  );
}

function HrTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Split }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-[#e1e0d9] bg-[#fcfcfb] px-3 py-2 text-sm shadow-sm">
      <div className="font-medium text-[#0b0b0b]">Km {point.km}</div>
      <div className="text-[#52514e]">{point.heartRate} bpm</div>
    </div>
  );
}

export function SplitsCharts({ splits }: { splits: Split[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">Ritmo por km</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={splits} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e1e0d9" />
            <XAxis
              dataKey="km"
              tick={{ fill: "#898781", fontSize: 12 }}
              axisLine={{ stroke: "#c3c2b7" }}
              tickLine={false}
            />
            <YAxis
              domain={["dataMin - 10", "dataMax + 10"]}
              tickFormatter={(v) => formatPace(v).replace(" /km", "")}
              tick={{ fill: "#898781", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<PaceTooltip />} />
            <Line
              type="monotone"
              dataKey="paceSecPerKm"
              stroke="#2a78d6"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          Frecuencia cardíaca por km
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={splits} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e1e0d9" />
            <XAxis
              dataKey="km"
              tick={{ fill: "#898781", fontSize: 12 }}
              axisLine={{ stroke: "#c3c2b7" }}
              tickLine={false}
            />
            <YAxis
              domain={["dataMin - 10", "dataMax + 10"]}
              tick={{ fill: "#898781", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<HrTooltip />} />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#eb6834"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
