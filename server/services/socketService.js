
const { Server } = require("socket.io");

// keep track of game rooms
let rooms = {};
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
        socket.emit("welcome", "Hello from server!");

        socket.on("connect", () => {
            socket.emit("hello", "I just connected!");
        });

        // Player requests a new room
        socket.on("createRoom", (customSize) => {
            const roomId = uuidv4().slice(0, 6); // short unique roomId
            rooms[roomId] = { players: [], board: Array(customSize * customSize).fill(null), currentPlayer: "X" };

            rooms[roomId].players.push(socket.id);
            socket.join(roomId);

            console.log("Room created ", rooms);

            socket.emit("roomCreated", roomId);
            socket.emit("playerAssignment", "X"); // first player is X
        });

        // Join a room
        socket.on("joinGame", (roomId) => {
            let room = rooms[roomId];
            if (!roomId || !rooms[roomId]) {
                socket.emit("noRoom", "Room not found");
                return;
            }
            console.log("Room Joined", roomId);

            console.log("Total Players", room.players.length);

            //   if (room.players.length >= 2) {
            //     socket.emit("errorMessage", "Room is full");
            //     return;
            //   }

            room.players.push(socket.id);
            socket.join(roomId);

            // Assign symbol to second player
            socket.emit("playerAssignment", "O");

            if (room.players.length === 2) {
                const symbol = room.players.length === 1 ? "X" : "O";
                socket.emit("playerAssignment", symbol);
                io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);

                io.to(roomId).emit("startGame", "Game started! Player X goes first.");
            } else {
                socket.emit("roomFull");
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);

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
            console.log("New game requested for room:", roomId);

            room.board = Array(9).fill(null);
            room.currentPlayer = "X";

            io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);
            io.to(roomId).emit("startGame", "New game started! Player X goes first.");
        });

        // Handle a move
        socket.on("makeMove", (roomId, index, player , winConditions) => {
            let room = rooms[roomId];
            if (!room) return;

            if (room.board[index] === null && player === room.currentPlayer) {
                room.board[index] = player;
                room.currentPlayer = player === "X" ? "O" : "X";

                io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);

                console.log("Check WinnConditions", winConditions);
                const result = checkWinner(room.board ,winConditions);
                console.log("The Result of winner is", result);
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
