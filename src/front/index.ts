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
        menu._open("start");
        menu.distanceAccept = true;
    }, { once: true });
}

menu.emitter.on("menuClosed", () => _fetch("hide"));

menu.emitter.on("menuOpened", () => {
    menu.distanceAccept = false;
});

menu.emitter.on("distance", (distance: number) => {
    const maxDistance = wolf.clientWidth - 10;
    const percent = Math.min(1, distance / maxDistance);
    wolf.style.setProperty("--alpha", percent.toString());
});