import { WolfMenu } from "@wxn0brp/plasma-wolf";
import { CommandMap } from "@wxn0brp/plasma-wolf/types";

const token = new URLSearchParams(window.location.search).get("token");
function _fetch(url: string) {
    return fetch("/api/" + url, {
        headers: {
            authorization: token
        }
    });
}

const commands: CommandMap = {
    start: [
        { name: "exit", action: () => { _fetch("exit").then(window.close) } },
        { name: "hide", action: () => { _fetch("hide") } },
        { name: "empty", action: () => { } },
        { name: "empty", action: () => { } },
        { name: "empty", action: () => { } },
        { name: "empty", action: () => { } },
        { name: "empty", action: () => { } },
        { name: "empty", action: () => { } },
    ]
}

const menu = new WolfMenu(commands, document.querySelector(".wolf"));
menu.init();