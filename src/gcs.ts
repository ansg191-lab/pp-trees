import { Feature } from "geojson";

export const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

export interface Tree {
  lat: number;
  lng: number;
  id: string;
  file: string;
  tag: string;
  hash: string;
  timestamp: Date;
}

export function TreeFromFeature(feat: Feature): Tree | undefined {
  const props = feat.properties;
  if (
    props == null ||
    typeof props !== "object" ||
    feat.geometry.type !== "Point"
  ) {
    return;
  }
  if (
    "timestamp" in props &&
    "file" in props &&
    "hash" in props &&
    "id" in props &&
    "tag" in props &&
    feat.geometry.coordinates.length === 2
  ) {
    const timestamp = new Date(String(props["timestamp"]));
    if (isNaN(timestamp.valueOf())) {
      throw new Error("Invalid timestamp");
    }
    return {
      lng: feat.geometry.coordinates[0],
      lat: feat.geometry.coordinates[1],
      id: String(props["id"]),
      file: String(props["file"]),
      tag: String(props["tag"]),
      hash: String(props["hash"]),
      timestamp,
    };
  }

  throw new Error("Invalid tree properties");
}
