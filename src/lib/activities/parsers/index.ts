import { parseGpxToActivity } from "@/lib/activities/parsers/gpx";
import type { NormalizedActivity } from "@/lib/activities/types";

export function parseActivityFile(filename: string, contents: string): NormalizedActivity {
  const ext = filename.toLowerCase().split(".").pop();

  switch (ext) {
    case "gpx":
      return parseGpxToActivity(contents);
    case "csv":
    case "tcx":
    case "fit":
      throw new Error(`Todavía no soportamos archivos .${ext}. Por ahora subí un .gpx.`);
    default:
      throw new Error("Formato de archivo no reconocido. Subí un .gpx.");
  }
}
