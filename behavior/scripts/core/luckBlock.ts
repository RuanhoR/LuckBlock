import { Player, type Block } from "@minecraft/server";
import { selectEvent } from "./utils";
import luckyEvents from "./events/luckyEvents";
import badEvents from "./events/badEvents";

export class LuckBlockCore {
  public static async onBreak(block: Block, player: Player) {
    const blockLuckNum = Number(
      block.getComponent("minecraft:dynamic_properties")?.get("lucknum")
        ? block.getComponent("minecraft:dynamic_properties")?.get("lucknum")
        : 0,
    );
    const exec = selectEvent(luckyEvents, badEvents, blockLuckNum);
    await exec(block, player);
  }
}
