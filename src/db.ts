import { Valthera } from "@wxn0brp/db";
import { RouteHandler } from "@wxn0brp/falcon-frame";
import { DbCommand } from "./shared/types";

export const db = new Valthera("data");

export async function getCommands() {
    const commandsRaw = await db.find<DbCommand>("commands");
    const map = new Map<string, DbCommand[]>();
    for (const command of commandsRaw) {
        const className = command.class;
        if (!map.has(className)) map.set(className, []);
        map.get(className)!.push(command);
    }
    return map;
}

export const getCommandsHandler: RouteHandler = async () => {
    const map = await getCommands();
    return Object.fromEntries(map);
};