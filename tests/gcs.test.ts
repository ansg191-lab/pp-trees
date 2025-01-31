import { expect, test } from "vitest";
import { TreeFromFeature, Tree } from "../src/gcs";
import { Feature, GeoJsonProperties } from "geojson";

test("TreeFromFeature - valid input", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [100.0, 0.0],
    },
    properties: {
      id: "tree-123",
      file: "tree-image.jpg",
      tag: "oak",
      hash: "abcd1234",
      timestamp: "2023-01-01T12:00:00Z",
    },
  };

  const expectedOutput: Tree = {
    lng: 100.0,
    lat: 0.0,
    id: "tree-123",
    file: "tree-image.jpg",
    tag: "oak",
    hash: "abcd1234",
    timestamp: new Date("2023-01-01T12:00:00Z"),
  };

  const result = TreeFromFeature(input);
  expect(result).toEqual(expectedOutput);
});

test("TreeFromFeature - missing properties", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [100.0, 0.0],
    },
    properties: {
      id: "tree-123",
      file: "tree-image.jpg",
      tag: "oak",
      // Missing "hash" and "timestamp"
    },
  };

  expect(() => TreeFromFeature(input)).toThrowError("Invalid tree properties");
});

test("TreeFromFeature - invalid geometry type", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Polygon", // Not a "Point"
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 1.0],
          [102.0, 2.0],
          [100.0, 0.0],
        ],
      ],
    },
    properties: {
      id: "tree-123",
      file: "tree-image.jpg",
      tag: "oak",
      hash: "abcd1234",
      timestamp: "2023-01-01T12:00:00Z",
    },
  };

  const result = TreeFromFeature(input);
  expect(result).toBeUndefined();
});

test("TreeFromFeature - properties is null", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [100.0, 0.0],
    },
    properties: null, // properties is null
  };

  const result = TreeFromFeature(input);
  expect(result).toBeUndefined();
});

test("TreeFromFeature - properties is not an object", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [100.0, 0.0],
    },
    properties: "invalid-properties" as unknown as GeoJsonProperties,
  };

  const result = TreeFromFeature(input);
  expect(result).toBeUndefined();
});

test("TreeFromFeature - invalid timestamp format", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [100.0, 0.0],
    },
    properties: {
      id: "tree-123",
      file: "tree-image.jpg",
      tag: "oak",
      hash: "abcd1234",
      timestamp: "invalid-date", // Invalid timestamp format
    },
  };

  expect(() => TreeFromFeature(input)).toThrowError("Invalid timestamp");
});

test("TreeFromFeature - geometry coordinates are invalid", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [100.0], // Missing latitude or longitude (only one coordinate provided)
    },
    properties: {
      id: "tree-123",
      file: "tree-image.jpg",
      tag: "oak",
      hash: "abcd1234",
      timestamp: "2023-01-01T12:00:00Z",
    },
  };

  expect(() => TreeFromFeature(input)).toThrowError("Invalid tree properties");
});

test("TreeFromFeature - edge case with empty properties and geometry", () => {
  const input: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [],
    },
    properties: {},
  };

  expect(() => TreeFromFeature(input)).toThrowError("Invalid tree properties");
});
