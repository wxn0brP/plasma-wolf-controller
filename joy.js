import { SerialPort, ReadlineParser } from "serialport";

const DEAD_ZONE = 10;
const REMAP_MIN = 0;
const REMAP_MAX = 255;
const RAW_MIN = 0;
const RAW_MAX = 4100;
const WEIGHT = 0.7;
const CENTER = 138;

let smoothedX = 0;
let smoothedY = 0;

function applyDeadZone(value) {
    if (Math.abs(value - CENTER) <= DEAD_ZONE) return CENTER;
    return value;
}

function remap(value) {
    const mapped = ((value - RAW_MIN) / (RAW_MAX - RAW_MIN)) * (REMAP_MAX - REMAP_MIN) + REMAP_MIN;
    return Math.round(mapped);
}

async function findESPPort() {
    const ports = await SerialPort.list();
    for (const port of ports) {
        if (port.vendorId && port.productId) {
            return port.path;
        }
    }
    throw new Error("ESP32/Arduino not found");
}

try {
    const portPath = await findESPPort();
    console.log("Using port:", portPath);

    const port = new SerialPort({
        path: portPath,
        baudRate: 115200
    });
    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", (line) => {
        let [rawX, rawY] = line.split(" ").map(a => a.trim()).map(a => parseInt(a));
        if (isNaN(rawX) || isNaN(rawY)) return;
        // console.log(`r: ${rawX}, y: ${rawY}`);

        let mappedX = applyDeadZone(remap(rawX));
        let mappedY = applyDeadZone(remap(rawY));

        // weighted smoothing
        // smoothedX = smoothedX * (1 - WEIGHT) + mappedX * WEIGHT;
        // smoothedY = smoothedY * (1 - WEIGHT) + mappedY * WEIGHT;
        smoothedX = mappedX;
        smoothedY = mappedY;

        const roundedX = Math.round(smoothedX);
        const roundedY = Math.round(smoothedY);
        console.log(`[${roundedX}, ${roundedY}]`);
    });
} catch (err) {
    console.error(err);
}