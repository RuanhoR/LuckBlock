import { ItemStack, type Block } from "@minecraft/server";
import itemData from "./itemData";
import { pickRandomItem, randomNum, spawnItem } from "./utils";

export class LuckBlockCore {
  private static _runItemRandomEvent(block: Block) {
    const item = pickRandomItem(itemData);
    const itemStack = new ItemStack(item, randomNum(1, 10));
    try {
      block.dimension.spawnItem(itemStack, block.location);
    } catch (err) {
      console.log("Spawn Item error: ");
      console.error(err);
    }
  }
  private static _summonLight(block: Block) {
    block.dimension.spawnEntity("minecraft:lightning_bolt", block.location);
  }
  private static _summonTNT(block: Block) {
    for (let i = 0; i < randomNum(1, 6); i++) {
      block.dimension.spawnEntity("minecraft:tnt", block.location);
    }
  }
  private static _redstoneToolEvent(block: Block) {
    const itemArr = [
      { id: "minecraft:dispenser", cout: 10 },
      { id: "minecraft:dropper", cout: 4 },
      { id: "minecraft:redstone", cout: 18 },
    ];
    spawnItem(itemArr, block.location, block.dimension);
  }
  private static _summonZombie(block: Block) {
    block.dimension.spawnEntity("minecraft:zombie", block.location);
  }
  private static _luckBlockEvent: ((block: Block) => Promise<void> | void)[] = [
    (b) => this._runItemRandomEvent(b),
    (b) => this._summonLight(b),
    (b) => this._summonTNT(b),
    (b) => this._redstoneToolEvent(b),
    (b) => this._summonZombie(b),
  ];
  public static async onBreak(block: Block) {
    const exec = pickRandomItem(this._luckBlockEvent);
    await exec(block);
  }
}
