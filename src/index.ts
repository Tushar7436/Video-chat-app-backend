import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { PeerServer } from "peer";
import serverConfig from "../config/serverConfig";
import roomHandler from "./handlers/RoomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);

const peerServer = PeerServer({
    path: "/myapp",
});

const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New User connected");
    roomHandler(socket); // pass the socket conn to the room handler for room creation and joining
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(serverConfig.PORT, () => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
    console.log(`PeerJS signaling endpoint at ws://localhost:${serverConfig.PORT}/myapp`);
});
