import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Pin from "../src/Pin";

test("renders unknown pin in blue", async () => {
  const { container } = render(<Pin tag="unknown" />);
  const pinElement = container.querySelector("svg");

  expect(pinElement).toBeTruthy();
  expect(pinElement?.style.fill).toBe("rgb(0, 0, 221)");
});

test("renders marked pin in red", async () => {
  const { container } = render(<Pin tag="marked" />);
  const pinElement = container.querySelector("svg");

  expect(pinElement).toBeTruthy();
  expect(pinElement?.style.fill).toBe("rgb(221, 0, 0)");
});

test("renders unmarked pin in green", async () => {
  const { container } = render(<Pin tag="unmarked" />);
  const pinElement = container.querySelector("svg");

  expect(pinElement).toBeTruthy();
  expect(pinElement?.style.fill).toBe("rgb(0, 221, 0)");
});
