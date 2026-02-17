import FalconFrame from "@wxn0brp/falcon-frame";
import crypto from "crypto";
import http from "http";
import { WebSocketServer } from "ws";

export const app = new FalconFrame();
export const server = http.createServer(app.getApp());
export const wss = new WebSocketServer({ server });

export const token = process.env["PLASMA_WOLF_TOKEN"] || crypto.randomBytes(16).toString("hex");
export const port = +process.env.PORT || 15965;
export const url = `http://127.0.0.1:${port}/?token=` + token;
