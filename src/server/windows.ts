import { spawn } from "child_process";
import { bin } from "./check";
import { url } from "./server";

export const window = spawn(bin, [url], { stdio: "pipe" });
window.on("exit", () => {
    process.exit(0);
});

function log(data: any) {
    const msg = data.toString() || "";
    console.log("stdout:", msg.trim());
}
window.stdout.on("data", log);
window.stderr.on("data", log);
