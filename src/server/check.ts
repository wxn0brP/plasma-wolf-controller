import { existsSync } from "fs";
import { env, platform } from "process";

if (platform === "win32") {
    console.log("Windows is shit");
    process.exit(1);
}

const de = env.XDG_CURRENT_DESKTOP || env.DESKTOP_SESSION || "unknown";
if (!/kde/i.test(de)) {
    console.warn(`⚠️  Detected desktop environment: ${de}.
This script was tested only under KDE - it may or may not work correctly.`);
}

export const bin = "native/build/plasma-wolf";
if (!existsSync(bin)) {
    console.log("❌ Native binary not found");
    console.log("Please build the native binary first:");
    console.log("```");
    console.log("cd native");
    console.log("./girl.sh");
    console.log("cd ..");
    console.log("```");
    process.exit(1);
}

if (process.env["PLASMA_WOLF_TOKEN"]) {
    console.log("⚠️ WARNING: Using environment variable for token");
}