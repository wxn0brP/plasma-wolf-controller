import { Valthera } from "@wxn0brp/db";
import { DbCommand } from "./shared/types";

const db = new Valthera("data");

const data: DbCommand[] = [
    { name: "Applications", class: "start", type: "go", to: "apps" },
    { name: "Media", class: "start", type: "go", to: "media" },
    { name: "Next", class: "start", type: "fetchApi", url: "screen/next" },
    { name: "Web", class: "start", type: "go", to: "web" },
    { name: "Wolf", class: "start", type: "go", to: "plasma-wolf" },
    { name: "Prev", class: "start", type: "fetchApi", url: "screen/prev" },

    { name: "Back", class: "plasma-wolf", type: "go", to: "start" },
    { name: "Exit", class: "plasma-wolf", type: "fetchApi", url: "exit" },

    { name: "Back", class: "apps", type: "go", to: "start" },
    { name: "Konsole", class: "apps", type: "execute", command: "konsole" },
    { name: "System Monitor", class: "apps", type: "execute", command: "plasma-systemmonitor" },
    { name: "Screenshot", class: "apps", type: "execute", command: "spectacle -r" },

    { name: "Back", class: "media", type: "go", to: "start" },
    { name: "Play / Pause", class: "media", type: "fetchApi", url: "media/playpause" },
    { name: "Next Track", class: "media", type: "fetchApi", url: "media/next" },
    { name: "Previous Track", class: "media", type: "fetchApi", url: "media/prev" },

    { name: "Back", class: "web", type: "go", to: "start" },
    { name: "GitHub", class: "web", type: "openUrl", url: "https://github.com" },
];


for (const command of data) {
    await db.updateOneOrAdd("commands", { name: command.name, class: command.class }, command, { id_gen: false });
}