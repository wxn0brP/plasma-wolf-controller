import { WolfMenu } from "@wxn0brp/plasma-wolf";
import { commands, initCommands } from "./commands";
import { _fetch } from "./utils";

initCommands();
const wolf = document.querySelector<HTMLDivElement>(".wolf");
const menu = new WolfMenu(commands, wolf);

menu._logFn = (...any: any[]) => {
    console.error("front", ...any);
};

menu.init();

(window as any)._wolf = (x: string, y: string) => {
    menu._x = +x;
    menu._y = +y;
    console.error("menu", menu._x, menu._y);
    document.addEventListener("mousemove", () => {
        menu.openMenu("start");
        menu.distanceAccept = true;
    }, { once: true });
}

menu.emitter.on("menuClosed", async () => {
    await new Promise(r => setTimeout(r, 100));
    if (menu._active) return;
    menu.distanceAccept = false;
    _fetch("hide");
});

menu.emitter.on("distance", (distance: number) => {
    const maxDistance = menu.body._actualRadius + menu.distanceCount;

    const percentAccent = Math.min(
        100,
        Math.max(0, Math.round(distance / maxDistance * 100))
    );

    const color = `color-mix(in srgb, var(--accent) ${percentAccent}%, white)`;
    wolf.style.setProperty("--color", color);
});

(window as any).menu = menu;

// const socket = new WebSocket(location.href.replace("http", "ws"));
// socket.onopen = () => {
//     console.error("WebSocket connection established");
// };

// socket.onmessage = (message) => {
//     const data = JSON.parse(message.data);
//     const [x, y] = data;
//     menu._startX = menu._x = window.innerWidth / 2;
//     menu._startY = menu._y = window.innerHeight / 2;

//     menu.openMenu("start");
//     menu.handleMove();
// };

// socket.onclose = () => {
//     console.error("WebSocket connection closed");
// };

// socket.onerror = (error) => {
//     console.error("WebSocket error:", JSON.stringify(error));
// };
