import { Command, CommandMap } from "@wxn0brp/plasma-wolf/types";
import { _fetch } from "./utils";
import { DbCommand } from "../shared/types";

export const commands: CommandMap = {};

export async function initCommands() {
    const commandsRaw = await _fetch("commands").then(r => r.json()) as Record<string, DbCommand[]>;
    for (const className of Object.keys(commandsRaw)) {
        commands[className] = commandsRaw[className].map(transformCommand);
    }
}

function transformCommand(command: DbCommand): Command {
    switch (command.type) {
        case "execute":
            return {
                name: command.name,
                action() {
                    _fetch("execute", {
                        command: command.command
                    });
                }
            };
        case "openUrl":
            return {
                name: command.name,
                action() {
                    _fetch("execute", {
                        command: "xdg-open " + command.url
                    })
                }
            };
        case "fetchApi":
            return {
                name: command.name,
                action() {
                    _fetch(command.url, command.body);
                }
            };
        case "go":
            return {
                name: command.name,
                go: command.to
            };
        default:
            const nev: never = command;
            throw new Error(`Unhandled case: ${nev}`);
    }
}