import { RouteHandler, Router } from "@wxn0brp/falcon-frame";
import { execSync } from "child_process";

export const router = new Router();

router.post("/execute", (req, res) => {
    const command = req.body.command;
    if (!command) {
        res.status(400);
        res.end();
        return;
    }
    console.log("execute", command);
    execSync(command);
});

const execHandler: (command: string) => RouteHandler = (cmd) => (() => {
    execSync(cmd);
    return "ok";
});

const mediaRouter = router.router("/media");
mediaRouter.get("/playpause", execHandler("playerctl play-pause"));
mediaRouter.get("/next", execHandler("playerctl next"));
mediaRouter.get("/prev", execHandler("playerctl previous"));

function getScreen() {
    const current = +execSync("qdbus org.kde.KWin /KWin currentDesktop").toString().trim();
    const raw = execSync(
        "qdbus --literal org.kde.KWin /VirtualDesktopManager org.kde.KWin.VirtualDesktopManager.desktops").toString().trim();
    const count = (raw.match(/\(uss\)/g) || []).length - 1;
    return [current, count];
}

const screenRouter = router.router("/screen");

screenRouter.get("/next", () => {
    const [current, count] = getScreen();
    let next = current + 1;
    if (current === count) next = 1;
    execSync(`qdbus org.kde.KWin /KWin setCurrentDesktop ${next}`);
    return "ok";
});

screenRouter.get("/prev", () => {
    const [current, count] = getScreen();
    let prev = current - 1;
    if (current === 1) prev = count;
    execSync(`qdbus org.kde.KWin /KWin setCurrentDesktop ${prev}`);
    return "ok";
});