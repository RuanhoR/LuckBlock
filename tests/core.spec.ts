import { describe, expect, it } from "vitest";
import { pickRandomItem, randomNum } from "../behavior/scripts/core/utils";
import { LoreParser } from "../behavior/scripts/core/loreParser";

describe("core/utils", () => {
  it("pickRandomItem returns an element of the array", () => {
    const arr = ["a", "b", "c"];
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(pickRandomItem(arr));
    }
  });

  it("randomNum stays within [min, max]", () => {
    for (let i = 0; i < 200; i++) {
      const n = randomNum(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
      expect(Number.isInteger(n)).toBe(true);
    }
    expect(randomNum(5, 5)).toBe(5);
  });
});

describe("LoreParser", () => {
  it("parses positive lore as good", () => {
    expect(LoreParser.parseLuckBlockLore("§a75")).toEqual({
      type: "good",
      num: 75,
    });
  });

  it("parses negative lore as bad", () => {
    expect(LoreParser.parseLuckBlockLore("§c-40")).toEqual({
      type: "bad",
      num: -40,
    });
  });

  it("rejects out-of-range numbers", () => {
    expect(() => LoreParser.parseLuckBlockLore("§a101")).toThrow(TypeError);
    expect(() => LoreParser.parseLuckBlockLore("§c-101")).toThrow(TypeError);
    expect(() => LoreParser.parseLuckBlockLore("§ax")).toThrow(TypeError);
  });

  it("generates colored lore from parsed values", () => {
    expect(LoreParser.generateLuckBlockLore({ type: "good", num: 30 })).toBe(
      "§a30",
    );
    expect(LoreParser.generateLuckBlockLore({ type: "bad", num: -30 })).toBe(
      "§c-30",
    );
    expect(() =>
      LoreParser.generateLuckBlockLore({ type: "good", num: 200 }),
    ).toThrow(TypeError);
  });
});
