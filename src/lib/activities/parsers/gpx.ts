import { XMLParser } from "fast-xml-parser";
import { haversineDistanceMeters } from "@/lib/activities/geo";
import type { NormalizedActivity } from "@/lib/activities/types";

const MOVING_SPEED_THRESHOLD_MS = 0.5; // below this, the point counts as a pause

type TrackPoint = {
  lat: number;
  lon: number;
  ele: number;
  time: number; // epoch ms
  cad?: number;
  hr?: number;
};

function mapGpxType(rawType: string | undefined): string {
  const type = (rawType ?? "").toLowerCase();
  if (type.includes("trail")) return "Trail Running";
  if (type.includes("run")) return "Running";
  if (type.includes("ride") || type.includes("cycl") || type.includes("bike")) return "Ciclismo";
  if (type.includes("walk") || type.includes("hik")) return "Caminata";
  return "Otro";
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseGpxToActivity(xml: string): NormalizedActivity {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);

  const gpx = doc.gpx;
  if (!gpx?.trk) {
    throw new Error("El archivo GPX no tiene ningún track (<trk>).");
  }

  const tracks = asArray(gpx.trk);
  const track = tracks[0];
  const segments = asArray(track.trkseg);

  const points: TrackPoint[] = [];
  for (const seg of segments) {
    for (const pt of asArray(seg.trkpt)) {
      const lat = parseFloat(pt["@_lat"]);
      const lon = parseFloat(pt["@_lon"]);
      const time = pt.time ? new Date(pt.time).getTime() : NaN;
      if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(time)) continue;

      const ext = pt.extensions?.["gpxtpx:TrackPointExtension"];
      points.push({
        lat,
        lon,
        ele: pt.ele !== undefined ? parseFloat(pt.ele) : 0,
        time,
        cad: ext?.["gpxtpx:cad"] !== undefined ? parseFloat(ext["gpxtpx:cad"]) : undefined,
        hr: ext?.["gpxtpx:hr"] !== undefined ? parseFloat(ext["gpxtpx:hr"]) : undefined,
      });
    }
  }

  if (points.length < 2) {
    throw new Error("El archivo GPX no tiene suficientes puntos para calcular una actividad.");
  }

  let distanceMeters = 0;
  let movingTimeSec = 0;
  let elevationGainMeters = 0;
  const cadences: number[] = [];
  const heartRates: number[] = [];
  const gpsTrack: [number, number, number][] = [];
  const splits: { km: number; timeSec: number; paceSecPerKm: number }[] = [];

  let nextSplitAtMeters = 1000;
  let splitStartTime = points[0].time;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    gpsTrack.push([p.lat, p.lon, p.ele]);
    if (p.cad !== undefined) cadences.push(p.cad);
    if (p.hr !== undefined) heartRates.push(p.hr);

    if (i > 0) {
      const prev = points[i - 1];
      const segmentDistance = haversineDistanceMeters(prev, p);
      const segmentTimeSec = (p.time - prev.time) / 1000;

      distanceMeters += segmentDistance;
      if (p.ele > prev.ele) elevationGainMeters += p.ele - prev.ele;

      if (segmentTimeSec > 0 && segmentDistance / segmentTimeSec >= MOVING_SPEED_THRESHOLD_MS) {
        movingTimeSec += segmentTimeSec;
      }

      while (distanceMeters >= nextSplitAtMeters) {
        const splitTimeSec = p.time / 1000 - splitStartTime / 1000;
        splits.push({
          km: splits.length + 1,
          timeSec: Math.round(splitTimeSec),
          paceSecPerKm: Math.round(splitTimeSec),
        });
        splitStartTime = p.time;
        nextSplitAtMeters += 1000;
      }
    }
  }

  const elapsedTimeSec = (points[points.length - 1].time - points[0].time) / 1000;
  const avgPaceSecPerKm = movingTimeSec > 0 ? movingTimeSec / (distanceMeters / 1000) : null;

  return {
    source: "GPX",
    externalId: new Date(points[0].time).toISOString(),
    type: mapGpxType(track.type),
    startDate: new Date(points[0].time),
    distanceMeters,
    movingTimeSec: Math.round(movingTimeSec),
    elapsedTimeSec: Math.round(elapsedTimeSec),
    avgPaceSecPerKm,
    avgHeartRate: heartRates.length ? average(heartRates) : null,
    maxHeartRate: heartRates.length ? Math.max(...heartRates) : null,
    avgCadence: cadences.length ? average(cadences) : null,
    elevationGainMeters: Math.round(elevationGainMeters),
    calories: null,
    splits,
    gpsTrack,
    feeling: null,
    notes: null,
  };
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
