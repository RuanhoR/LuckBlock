import { Command } from "@mbler/mcx";
import {
  CommandPermissionLevel,
  CustomCommandStatus,
  world,
} from "@minecraft/server";

export const debugCommand = new Command("rluckblock:worlddypropdebug");

debugCommand.addMandatoryParameter("option: [remove | list | read]", "string");
debugCommand.addOptionalParameter("value: any", "string");
debugCommand.setPermissionLevel(CommandPermissionLevel.Admin);
debugCommand.action((origin, ...args) => {
  if (origin.sourceEntity?.typeId !== "minecraft:player") {
    return {
      status: CustomCommandStatus.Failure,
      message: "Must Player exec",
    };
  }
  if (args[0] == "remove" && typeof args[1] == "string") {
    world.setDynamicProperty(args[1]);
    return {
      status: CustomCommandStatus.Success,
      message: "ok",
    };
  }
  if (args[0] == "list") {
    return {
      status: CustomCommandStatus.Success,
      message: `success with data: ${world.getDynamicPropertyIds()}`,
    };
  }
  if (args[0] == "read" && typeof args[1] == "string") {
    return {
      status: CustomCommandStatus.Success,
      message: `success with ddata: ${world.getDynamicProperty(args[1])}`,
    };
  }
  return {
    status: CustomCommandStatus.Failure,
    message: "Invaild Paramer",
  };
});
