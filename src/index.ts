import { spawn } from "child_process";
import { api } from "./server/api";
import { app, port, server, url } from "./server/server";
import { window } from "./server/windows";
import "./server/wss";
import { socket } from "./server/wss";

app.static("public");
app.static("dist");

server.listen(port, "127.0.0.1", () => {
    console.log(`Server started at ${url}`);
});

app.use(api);

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

setTimeout(() => {
    const node = spawn("node", ["dist/joy.js"], { stdio: "pipe" });
    node.stdout.on("data", (data) => {
        const msg = data.toString() || "";
        if (!msg) return;

        if (msg.startsWith("Using")) {
            console.log(msg);
            return;
        }

        if (socket)
            socket.send(data.toString());
    });
}, 2_000);
