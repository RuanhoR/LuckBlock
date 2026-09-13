// @ts-check
import { defineConfig } from "@mbler/mfd";

export default defineConfig({
  title: { zh: "幸运方块", en: "Lucky Block" },
  mcVersion: { min: "1.26.30", max: "1.26.45" },
  description: {
    zh: `# 幸运方块 (Lucky Block)

一个简单的 Minecraft 基岩版**幸运方块**玩法模组，基于 [mcx-core](https://github.com/RuanhoR/mcx-core) 脚本构建。

## 仓库

GitHub: [LuckBlock](https://github.com/RuanhoR/LuckBlock)

## 安装

选择与你的 Minecraft 版本匹配的 \`dist.mcaddon\` 下载后导入游戏即可。
`,
    en: `# Lucky Block

A simple Minecraft Bedrock **Lucky Block** gameplay addon, built with [mcx-core](https://github.com/RuanhoR/mcx-core) scripts.

## Repository

GitHub: [LuckBlock](https://github.com/RuanhoR/LuckBlock)

## Install

Download the \`dist.mcaddon\` matching your Minecraft version and import it into the game.
`,
  },
  entryAddonManifest: "/assets/manifest.addon.json",
  entryDistAddon: "/assets/dist.mcaddon",
  base: "/lucky-block/",
  distEntry: "./dist-page",
  addon: "./dist.mcaddon",
  port: 9527,
});
