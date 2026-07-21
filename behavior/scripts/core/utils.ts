import {
  Block,
  EntityComponentTypes,
  EquipmentSlot,
  ItemStack,
  Player,
  type Dimension,
  type Vector3,
} from "@minecraft/server";

export function pickRandomItem<T extends unknown[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
interface itemDesc {
  name?: string;
  id: string;
  cout?: number;
}
export function spawnItem(
  itemArr: itemDesc[],
  location: Vector3,
  dim: Dimension,
) {
  for (const i of itemArr) {
    const item = new ItemStack(i.id, i.cout || 1);
    if (i.name) item.nameTag = i.name;
    dim.spawnItem(item, location);
  }
}
export function selectEvent(
  luckEvents: ((block: Block, player: Player) => Promise<void> | void)[],
  badEvents: ((block: Block, player: Player) => Promise<void> | void)[],
  currenyLuck: number,
): (block: Block, player: Player) => Promise<void> | void {
  const clampedLuck = Math.max(-100, Math.min(100, currenyLuck));
  const normalized = clampedLuck / 100;
  const goodProbability = 1 / (1 + Math.exp(-normalized * 4)) + 0.2;
  if (Math.random() + new Date().getSeconds() / 1000 < goodProbability) {
    const randomIndex = Math.floor(Math.random() * luckEvents.length);
    return luckEvents[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * badEvents.length);
    return badEvents[randomIndex];
  }
}
export function mainhand(player: Player): ItemStack | void {
  return player
    .getComponent(EntityComponentTypes.Equippable)
    ?.getEquipmentSlot(EquipmentSlot.Mainhand)
    .getItem();
}
