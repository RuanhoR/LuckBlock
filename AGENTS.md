# LucklyBlock — Agent Guide

Minecraft Bedrock addon (Luck Block). Built with [mbler](https://github.com/RuanhoR/mbler) + MCX DSL. No tests; no CI.

## ⚠️ 包管理器：只用 pnpm

**禁止 `npm run ...` / `npx <tool>`。** 全局 npm 里装过一个坏掉的 mbler，
npm/npx 会把 bin 解析到
`C:\Users\Administrator\AppData\Roaming\npm\node_modules\mbler\...`
导致 `Cannot find module` 类错误；pnpm 走项目内 `node_modules/.bin`，一切正常。

```bash
pnpm install            # 安装依赖（版本全部精确锁定，见下）
pnpm type-check         # mcx-tsc 严格类型检查 —— 改动后必跑
pnpm build              # release 构建，唯一会写 dist/ 与 dist.mcaddon 的命令
pnpm dev-build          # 开发构建：写游戏 development_packs 目录（outGameOnDev），不碰 dist/
pnpm dev                # mbler watch

# 验证顺序：改完 → pnpm type-check → pnpm build → 检查 dist/ 输出
```

## 工具链版本（精确锁定，勿随意升级）

- `mbler@0.2.14-rc.0`
- `@mbler/mcx-core@0.1.3-rc.16`（blocks/recipes 组件输出需要 ≥ rc.16）
- `@mbler/mcx-component@0.0.3-rc.1`

升级任一包前先确认互相兼容（core rc.16 ↔ component 0.0.3.x ↔ types rc.8）。

## Layout / ownership

```
behavior/scripts/
  index.ts               # 入口：createApp + 注册命令 + 各 .mcx 副作用导入
  app.mcx                # <App> 定义
  event.mcx / eventAfter.mcx   # <Event> 定义（before/after）
  DefineItems.mcx        # 物品组件（rluckblock:luckly_apple / luckly_sword）
  components/blocks.mcx  # 方块组件（rluckblock:block）
  components/recipes.mcx # 三个合成配方
  core/                  # 运行时逻辑（luckBlock 抽奖核心、事件表、词缀解析）
  command/               # 自定义命令注册
  assets/                # 物品图标 png（被 ItemComponent.setIcon 引用）
resources/               # 纯静态资源：terrain_texture.json、blocks.json、texts、贴图 —— 保持 JSON，不要转 mcx
behavior/structures/     # .mcstructure 结构文件 —— 保持原样
behavior/pack_icon.png、resources/pack_icon.png
```

manifest.json 由 mbler 生成，不手写。

## MCX 组件约定

- `<Component>` 文件里子标签内容是 **导出名**（如 `<recipe id="lucklyblock.json">lucklyBlockRecipe</recipe>` 对应 script 内的命名导出）。
- 新文件必须在 `index.ts` 里副作用导入一次（如 `import "./components/blocks.mcx"`），否则编译器不会执行它。
- 配方 `format` 必须是三段式（如 `"1.12.0"`）；`RecipeComponent` 会拒绝 `"1.12"`。
- 方块贴图用 terrain_texture.json 里的字符串 key（`"luckblock"`），资源目录不做转换。

## Gotchas

- 幸运方块 loot 固定为 `loot_tables/empty.json`（掉落物由脚本运行时发放，不是战利品表）。
- `eventAfter.mcx` 的 `onPlayerSpawn` 有 `initialSpawn` 守卫 —— 防止每次重生重复放置初始化结构，别删。
- `mcVersion: '1.26.31'`，依赖的 @minecraft/server 是对应 beta 版本，升级需整体评估。
- `dist.mcaddon` 仅 release 构建产出；`dev-build` 之后不要去检查 dist/。
