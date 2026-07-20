import { ItemStack, Player, world, type Block } from "@minecraft/server";
import itemData from "./itemData";
import { pickRandomItem, randomNum, selectEvent, spawnItem } from "./utils";

export class LuckBlockCore {
  // spawn random item event
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
  // lighting bolt event
  private static _summonLight(block: Block) {
    block.dimension.spawnEntity("minecraft:lightning_bolt", block.location);
  }
  // tnt event
  private static _summonTNT(block: Block) {
    for (let i = 0; i < randomNum(1, 6); i++) {
      block.dimension.spawnEntity("minecraft:tnt", block.location);
    }
  }
  // redstone tools event
  private static _redstoneToolEvent(block: Block) {
    const itemArr = [
      { id: "minecraft:dispenser", cout: 10 },
      { id: "minecraft:dropper", cout: 4 },
      { id: "minecraft:redstone", cout: 18 },
    ];
    spawnItem(itemArr, block.location, block.dimension);
  }
  // spawn zombie event
  private static _summonZombie(block: Block) {
    block.dimension.spawnEntity("minecraft:zombie", block.location);
  }
  // obsidian room
  private static _obsidianWaterRoomEvent(block: Block, p: Player) {
    world.structureManager.place(
      "luckblock_obsidian_waterplace",
      block.dimension,
      block.location,
    );
    p.teleport({
      x: block.location.x + 1,
      y: block.location.y + 1,
      z: block.location.z + 1,
    });
  }
  private static _luckEvent: ((
    block: Block,
    player: Player,
  ) => Promise<void> | void)[] = [
    (b) => this._runItemRandomEvent(b),
    (b) => this._redstoneToolEvent(b),
    (b) => this._runItemRandomEvent(b),
    (b) =>
      void b.dimension.runCommand(
        `fill ${b.location.x} ${b.location.y} ${b.location.z} ${b.location.x} ${b.location.y + 3} ${b.location.z} diamond_block`,
      ),
    (b) =>
      void b.dimension.runCommand(
        `fill ${b.location.x} ${b.location.y} ${b.location.z} ${b.location.x} ${b.location.y + 3} ${b.location.z} emerald_block`,
      ),
    (b) =>
      void spawnItem(
        [
          {
            id: "diamond",
            cout: randomNum(1, 8),
          },
          {
            id: "emerald",
            cout: randomNum(3, 10),
          },
          {
            id: "lapis_lazuli",
            cout: randomNum(6, 99),
          },
          {
            id: "iron_ingot",
            cout: randomNum(10, 66),
          },
          {
            id: "gold_ingot",
            cout: randomNum(4, 30),
          },
        ],
        b.location,
        b.dimension,
      ),
  ];
  private static _badEvent: ((
    block: Block,
    player: Player,
  ) => Promise<void> | void)[] = [
    (b) => this._summonZombie(b),
    (b, p) => this._obsidianWaterRoomEvent(b, p),
    (b) => this._summonLight(b),
    (b) => this._summonTNT(b),
    (b) =>
      void b.dimension.runCommand(
        `fill ${b.location.x + 5} ${b.location.y + 2} ${b.location.z + 5} ${b.location.x - 5} ${b.location.y + 3} ${b.location.z - 5} anvil`,
      ),
  ];
  public static async onBreak(block: Block, player: Player) {
    const blockLuckNum = Number(
      block.getComponent("minecraft:dynamic_properties")?.get("lucknum")
        ? block.getComponent("minecraft:dynamic_properties")?.get("lucknum")
        : 0,
    );
    const exec = selectEvent(this._luckEvent, this._badEvent, blockLuckNum);
    await exec(block, player);
  }
}
