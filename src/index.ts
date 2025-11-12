import FalconFrame from "@wxn0brp/falcon-frame";
import { execSync, spawn } from "child_process";
import crypto from "crypto";
import http from "http";
import { getCommandsHandler } from "./db";
import { bin } from "./check";

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
setTimeout(() => {
    window.kill("SIGUSR1");
}, 2000);

const api = app.router("/api");
api.use((req, res, next) => {
    if (req.headers.authorization !== token) {
        res.status(401);
        res.end();
        return;
    }
    console.log("api", req.method, req.url);
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

api.post("/execute", (req, res) => {
    const command = req.body.command;
    if (!command) {
        res.status(400);
        res.end();
        return;
    }
    console.log("execute", command);
    execSync(command);
});