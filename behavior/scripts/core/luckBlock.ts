import {
  Dimension,
  Entity,
  Player,
  system,
  world,
  type Block,
  type Vector3,
} from "@minecraft/server";
import { selectEvent } from "./utils";
import luckyEvents from "./events/luckyEvents";
import badEvents from "./events/badEvents";
import { LoreParser } from "./loreParser";
import { luckBlockTypeId, WorldDymicPropKeys } from "../config";

export class LuckBlockCore {
  public static async onBreak(block: Block, player: Player) {
    // don't clean luckBlock item, because loot null
    // need get block luckNum from world Dyprop
    const luckNum =
      this.removeAndReturnBlockLuckNumData(block.location, block.dimension) ||
      0;
    const exec = selectEvent(luckyEvents, badEvents, luckNum);
    await exec(block, player);
  }
  public static async onHit(entity: Entity, player: Player) {
    const exec = selectEvent(luckyEvents, badEvents, 0);
    await exec(entity, player);
  }
  public static LoreParser = LoreParser;
  public static addBlockLuckNumData(
    location: Vector3,
    dimension: Dimension,
    num: number,
  ) {
    let oldValue = world.getDynamicProperty(
      WorldDymicPropKeys.LuckBlockMap,
    ) as string;
    if (!oldValue || typeof oldValue !== "string") oldValue = "[]";
    let oldParsed: {
      l: Vector3;
      d: string;
      n: number;
    }[];
    try {
      oldParsed = JSON.parse(oldValue);
    } catch (_) {
      console.warn(`[LuckBlockCore]: Parse Block Data Error: ${_}`);
      oldParsed = [];
    }
    oldParsed.push({
      l: location,
      d: dimension.id,
      n: num,
    });
    world.setDynamicProperty(
      WorldDymicPropKeys.LuckBlockMap,
      JSON.stringify(oldParsed),
    );
  }
  private static removeAndReturnBlockLuckNumData(
    location: Vector3,
    dimension: Dimension,
  ) {
    let oldValue = world.getDynamicProperty(
      WorldDymicPropKeys.LuckBlockMap,
    ) as string;
    if (!oldValue || typeof oldValue !== "string") oldValue = "[]";
    let oldParsed: {
      l: Vector3;
      d: string;
      n: number;
    }[];
    try {
      oldParsed = JSON.parse(oldValue);
    } catch (_) {
      console.warn(`[LuckBlockCore]: Parse Block Data Error: ${_}`);
      oldParsed = [];
    }
    const index = oldParsed.findIndex((v) => {
      return (
        v.d == dimension.id &&
        v.l.x == location.x &&
        v.l.y == location.y &&
        v.l.z == location.z
      );
    });
    const luckNum = oldParsed[index].n;
    oldParsed.splice(index, 1);
    world.setDynamicProperty(
      WorldDymicPropKeys.LuckBlockMap,
      JSON.stringify(oldParsed),
    );
    return luckNum;
  }
  public static startLoop() {
    system.runInterval(
      () =>
        system.run(() => {
          try {
            let oldValue = world.getDynamicProperty(
              WorldDymicPropKeys.LuckBlockMap,
            ) as string;
            if (!oldValue || typeof oldValue !== "string") oldValue = "[]";
            let oldParsed: {
              l: Vector3;
              d: string;
              n: number;
            }[];
            try {
              oldParsed = JSON.parse(oldValue);
            } catch (_) {
              console.warn(`[LuckBlockCore]: Parse Block Data Error: ${_}`);
              oldParsed = [];
            }
            for (
              let blockDataIndex = 0;
              blockDataIndex < oldParsed.length;
              blockDataIndex++
            ) {
              const blockData = oldParsed[blockDataIndex];
              if (!blockData) continue;
              const isVaild =
                world.getDimension(blockData.d).getBlock(blockData.l)?.typeId ==
                luckBlockTypeId;
              if (!isVaild) {
                oldParsed.splice(blockDataIndex, 1);
              }
            }
            world.setDynamicProperty(
              WorldDymicPropKeys.LuckBlockMap,
              JSON.stringify(oldParsed),
            );
          } catch (err) {
            console.warn("Check LuckBlock err: " + err);
          }
        }),
      100,
    );
  }
}
