
const { Server } = require("socket.io");

// keep track of game rooms
let rooms = {};
// keep track of online users (keyed by username for uniqueness)
let onlineUsers = {};
// map socket.id to username
let socketToUser = {};
const { v4: uuidv4 } = require("uuid");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        },
        pingTimeout: 60 * 1000,
        pingInterval: 25000,
    });

    io.on("connection", (socket) => {
        // User connected
        socket.on("user_connected", (user) => {
            if (user && user.username) {
                onlineUsers[user.username] = user;
                socketToUser[socket.id] = user.username;
                io.emit("onlineUsers", Object.values(onlineUsers), "");
            }
        });

        // Get online users
        socket.on("getOnlineUsers", (roomId) => {
            socket.emit("onlineUsers", Object.values(onlineUsers), roomId);
        });

        // RoomId sharing between two matched players
        socket.on("roomIdShared", (roomId, opponentUsername) => {
            const opponentSocketId = Object.keys(socketToUser)
                .find(key => socketToUser[key] === opponentUsername);

            if (opponentSocketId) {
                io.to(opponentSocketId).emit("roomIdReceived", roomId);
            }
            console.log("RoomId shared", roomId ,opponentUsername)
        });

        // Player requests a new room
        socket.on("createRoom", (customSize, mode, user) => {
            const roomId = uuidv4().slice(0, 6); // short unique roomId
            rooms[roomId] = { players: [], board: Array(customSize * customSize).fill(null), currentPlayer: "X", mode: mode, roomId: roomId, users: [], customSize: customSize };

            rooms[roomId].players.push(socket.id);
            rooms[roomId].users.push(user);
            socket.join(roomId);
            socket.emit("roomCreated", roomId);
            console.log("RoomId Created", roomId , user);
        });

        // Join a room
        socket.on("joinGame", (roomId, user) => {
            let room = rooms[roomId];
            if (!roomId || !rooms[roomId]) {
                socket.emit("noRoom", "Room not found");
                return;
            }
            room.players.push(socket.id);
            room.users.push(user);
            socket.join(roomId);

            // Assign symbol to second player
            if (room.players.length === 2) {
                // Share player info with both players
                const playersInfo = [
                    { id: room.players[0], symbol: "X", user: room.users[0], roomId: roomId, mode: room.mode, customSize: Math.sqrt(room.board.length) },
                    { id: room.players[1], symbol: "O", user: room.users[1], roomId: roomId, mode: room.mode, customSize: Math.sqrt(room.board.length) }
                ];
                io.to(roomId).emit("playersInfo", playersInfo);

                io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);

                io.to(roomId).emit("startGame", "Game started! Player X goes first.");
            } else {
                socket.emit("roomFull");
            }
            console.log("RoomId Joined", roomId , user);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);

            // Remove from online users
            const username = socketToUser[socket.id];
            if (username) {
                delete onlineUsers[username];
                delete socketToUser[socket.id];
                io.emit("onlineUsers", Object.values(onlineUsers));
            }

            for (let roomId in rooms) {
                if (rooms[roomId].players.includes(socket.id)) {
                    // tell all users in the room to refresh BEFORE removing
                    io.to(roomId).emit("forceRefresh");

                    // now remove this user
                    rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);

                    // delete room if empty
                    if (rooms[roomId].players.length === 0) {
                        delete rooms[roomId];
                    }
                }
            }
        });

        socket.on("newGame", (roomId) => {
            const room = rooms[roomId];
            if (!room) return;

            room.board = Array(room.customSize * room.customSize).fill(null);
            room.currentPlayer = "X";

            io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);
            io.to(roomId).emit("startGame", "New game started! Player X goes first.");
        });

        // Handle a move
        socket.on("makeMove", (roomId, index, player, winConditions) => {
            let room = rooms[roomId];
            if (!room) return;

            if (room.board[index] === null && player === room.currentPlayer) {
                room.board[index] = player;
                room.currentPlayer = player === "X" ? "O" : "X";

                io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);

                const result = checkWinner(room.board, winConditions);
                if (result) {
                    io.to(roomId).emit("gameOver", `Player ${result.winner} wins!`, result.winner, result.cells);
                } else if (room.board.every(c => c !== null)) {
                    io.to(roomId).emit("gameOver", "It's a draw!", null, []);
                }
            }
        });
    });
    // Check winner using the patterns
    function checkWinner(board, winConditions) {
        for (let condition of winConditions) {
            const values = condition.map(i => board[i]);
            if (values.every(v => v && v === values[0])) {
                return { winner: values[0], cells: condition }; // ✅ winner + winning cells
            }
        }

        return null;
    }
    return io;
};

module.exports = initializeSocket;
