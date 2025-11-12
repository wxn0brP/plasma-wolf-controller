import FalconFrame from "@wxn0brp/falcon-frame";
import { spawn } from "child_process";
import crypto from "crypto";
import http from "http";
import { router as apiRouter } from "./api";
import { bin } from "./check";
import { getCommandsHandler } from "./db";

const token = process.env["PLASMA_WOLF_TOKEN"] || crypto.randomBytes(16).toString("hex");

const app = new FalconFrame();
app.static("public");
app.static("dist");
const server = http.createServer(app.getApp());
const port = +process.env.PORT || 15965;
const url = `http://127.0.0.1:${port}/?token=` + token;
server.listen(port, "127.0.0.1", () => {
    console.log(`Server started at ${url}`);
});

const window = spawn(bin, [url], { stdio: "inherit" });
window.on("exit", () => {
    process.exit(0);
});

const api = app.router("/api");
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

process.on("SIGINT", () => {
    window.kill("SIGINT");
});

process.on("uncaughtException", (e) => {
    console.error("Uncaught exception:", e);
});

process.on("unhandledRejection", (e) => {
    console.error("Unhandled rejection:", e);
});

setTimeout(() => {
    window.kill("SIGUSR1");
}, 1000);