import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interface/IRoomParams";

    /**
     * {{1: u1, u2, u3},{2: u4,u5,u6}}
     */
    const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        // this will be our uinque room id in which multiple connection will exchange data
        const roomId = UUIDv4(); 

        // we will make the socket connection enter a new room
        socket.join(roomId); 

        //create a new entry for the rooom
        rooms[roomId] = [];

        // we will emit an event fromserver side that socket connection has been added to a room
        socket.emit("room-created", { roomId }); 
        console.log("incoming request Room created", roomId);
    };

    /**
     *
     * The below function is executed everytime a user(creator or joiner) joins
     * a new room
     */
    const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
        console.log("joined room called", rooms, roomId, peerId);
        if (rooms[roomId]) {
            // If the given roomId exist in the in memory db 
            console.log("New user has joined the room", roomId, "with peerId as:", peerId);
            // the moment new user joins, add the peerId to the key of roomId
            rooms[roomId].push(peerId);
            console.log("added peer to room", rooms);
            socket.join(roomId); // make the user join the socket room


            //below event is for logging purpose
            socket.emit('get-user',{
                roomId,
                participants: rooms[roomId]
            });
        }
    };

    // when to call the above functions

    // we will call the above two function when the client will emit events top create room and join room
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);

};

export default roomHandler;
