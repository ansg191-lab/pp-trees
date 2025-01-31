import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Popup from "../src/Popup";
import { S3_BASE_URL, Tree } from "../src/gcs.ts";

const mockTree: Tree = {
  lng: 12.34,
  lat: 56.78,
  id: "1EExRTuJoiAkjLhMnHpeCtHOSw1khxnZE",
  file: "sample-file.webp",
  tag: "marked",
  hash: "abcd1234",
  timestamp: new Date("2023-10-30T12:00:00Z"),
};

test("renders tag name", async () => {
  const { getByText } = render(<Popup {...mockTree} />);
  await expect.element(getByText(mockTree.tag)).toBeInTheDocument();
});

test("renders file name", async () => {
  const { getByText } = render(<Popup {...mockTree} />);
  await expect.element(getByText(mockTree.file)).toBeInTheDocument();
});

test("renders image", async () => {
  const { getByAltText } = render(<Popup {...mockTree} />);
  const image = getByAltText("tree");
  await expect.element(image).toBeInTheDocument();
  await expect
    .element(image)
    .toHaveAttribute("src", `${S3_BASE_URL}${mockTree.id}-small.webp`);
});
