// Minimal @minecraft/server(+ui) stub for unit tests under Node.
// The beta runtime packages cannot resolve/load outside Minecraft, so tests
// alias them here — only the import-time surface needs to exist.
export const world = {
  getDimension: () => {
    throw new Error("not available outside Minecraft");
  },
  sendMessage: () => {},
};
export const system = { run: (fn: () => void) => fn() };
export const BlockComponentTypes = {};

// value imports used by scripts (types survive as plain exports)
export class ItemStack {
  constructor(
    public _id?: string,
    public _amount?: number,
  ) {}
}
export class Block {}
export class Player {}
export const EquipmentSlot = { Mainhand: "Mainhand", Offhand: "Offhand" };
export const EntityComponentTypes = {};
export const EnchantmentType = {};

// @minecraft/server-ui reactive primitives used by some runtimes
export class ObservableString {
  constructor(public value: string) {}
  subscribe() {}
  getData() {
    return this.value;
  }
  setData(v: string) {
    this.value = v;
  }
}
export class ObservableBoolean {
  constructor(public value: boolean) {}
  subscribe() {}
  getData() {
    return this.value;
  }
  setData(v: boolean) {
    this.value = v;
  }
}
export class ObservableNumber {
  constructor(public value: number) {}
  subscribe() {}
  getData() {
    return this.value;
  }
  setData(v: number) {
    this.value = v;
  }
}
