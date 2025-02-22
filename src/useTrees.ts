import useSWR from "swr";
import { S3_BASE_URL, TreeFromFeature } from "./gcs.ts";
import { FeatureCollection } from "geojson";
import { useMemo } from "react";

export default function useTrees() {
  const { data, error, isLoading } = useSWR(
    `${S3_BASE_URL}trees.json`,
    fetchTrees,
  );

  const trees = useMemo(
    () => data?.features.map(TreeFromFeature).filter((x) => x !== undefined),
    [data],
  );

  return { trees, isLoading, error };
}

async function fetchTrees(url: string): Promise<FeatureCollection> {
  const response = await fetch(url);
  return response.json();
}
