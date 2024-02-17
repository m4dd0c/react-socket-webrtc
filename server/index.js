import express from "express";
import { createServer } from "http";
import SocketService from "./services/Socket.js";

const app = express();
const port = 4000;

const server = createServer(app);
const socketService = new SocketService(server);
const _io = socketService.io;

server.listen(port, () => console.log("listening on port", port));

// ************ io thing
_io.on("connection", (socket) => socketService.connection(socket));



