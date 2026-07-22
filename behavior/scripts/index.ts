import { createApp, registryCommand } from "@mbler/mcx";
import app from "./app.mcx";
import { world } from "@minecraft/server";
createApp(app).mount(world);
