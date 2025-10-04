import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";
import serverConfig from "../config/serverConfig";
import roomHandler from "./handlers/RoomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
    transports: ["websocket", "polling"]
});

const peerServer = ExpressPeerServer(server, {
    path: "/myapp",
    allow_discovery: false,
    alive_timeout: 60000,
});

app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
    console.log("New User connected");
    roomHandler(socket); // pass the socket conn to the room handler for room creation and joining
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(serverConfig.PORT, () => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
});
