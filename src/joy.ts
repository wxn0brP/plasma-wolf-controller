import { SerialPort, ReadlineParser } from "serialport";

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
        baudRate: +process.env.BAUD_RATE || 9600
    });

    const parser = port.pipe(
        new ReadlineParser({ delimiter: "\n" })
    );

    let lastX = 0;
    let lastY = 0;

    parser.on("data", (line: string) => {
        let [rawX, rawY] = line
            .split(" ")
            .map(v => parseInt(v.trim(), 10));

        if (Number.isNaN(rawX) || Number.isNaN(rawY)) return;
        rawX = Math.min(8, rawX);
        rawY = Math.min(8, rawY);

        if (rawX === lastX && rawY === lastY) return;
        lastX = rawX;
        lastY = rawY;

        console.log(`[${rawX}, ${rawY}]`);
    });

} catch (err) {
    console.error(err);
}
