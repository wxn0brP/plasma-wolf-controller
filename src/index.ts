import FalconFrame from "@wxn0brp/falcon-frame";
import { existsSync } from "fs";
import crypto from "crypto";
import http from "http";
import { spawn } from "child_process";

const bin = "native/build/plasma-wolf";
if (!existsSync(bin)) {
    console.log("Native binary not found");
    console.log("Please build the native binary first:");
    console.log("```");
    console.log("cd native");
    console.log("./girl.sh");
    console.log("cd ..");
    console.log("```");
    process.exit(1);
}

const token = crypto.randomBytes(16).toString("hex");

const app = new FalconFrame();
app.static("public");
app.static("dist");
const server = http.createServer(app.getApp());
const url = "http://127.0.0.1:15965/?token=" + token;
server.listen(15965, "127.0.0.1", () => {
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
    console.log("api", req.url);
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