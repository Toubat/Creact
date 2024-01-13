import Creact from "../core/creact";
import { describe, expect, it } from "vitest";

describe("createElement", () => {
  it("props is null", () => {
    const el = Creact.createElement("div", null, "hi");

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `);
  });

  it("should return vdom for element", () => {
    const el = Creact.createElement("div", { id: "id" }, "hi");

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "id",
        },
        "type": "div",
      }
    `);
  });
});
