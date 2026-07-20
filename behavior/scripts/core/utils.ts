import { ItemStack, type Dimension, type Vector3 } from "@minecraft/server";

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
