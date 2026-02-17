import { router as apiRouter } from "./api.commands";
import { getCommandsHandler } from "./db.utils";
import { app, token } from "./server";
import { window } from "./windows";

export const api = app.router("/api");
api.use((req, res, next) => {
    if (req.headers.authorization !== token) {
        res.status(401);
        res.end();
        return;
    }
    console.log("💜 api", req.method, req.url);
    next();
})

api.get("/exit", () => {
    try {
        window.kill("SIGINT");
    } catch (e) {
        console.error(e);
        try {
            window.kill("SIGKILL");
        } catch (e) {
            console.error(e);
        }
    }
    finally {
        process.exit(0);
    }
});

api.get("/hide", () => {
    window.kill("SIGUSR1");
    return "ok";
});

api.get("/commands", getCommandsHandler);
api.use(apiRouter);

api.all("*", (req, res) => {
    console.log("💔 404", req.method, req.url);
    res.status(404);
    res.end();
});
