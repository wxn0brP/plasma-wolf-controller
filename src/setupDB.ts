import { Valthera } from "@wxn0brp/db";
import { DbCommand } from "./shared/types";

const db = new Valthera("data");

const data: DbCommand[] = [
    { name: "exit", class: "start", type: "fetchApi", url: "exit" },
]

for (const command of data) {
    await db.updateOneOrAdd("commands", { name: command.name, class: command.class }, command, { id_gen: false });
}