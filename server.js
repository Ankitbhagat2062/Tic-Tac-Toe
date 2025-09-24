const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// start 
require('dotenv').config();
const mongoose = require('mongoose');
require('./server/passport/passport');
const passport = require('passport');
const configs = require('./server/configs/config');
// end 

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite's default port
        methods: ["GET", "POST"]
    }
});

// Authentication middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Vite's default port
    credentials: true
}));

// from here 
app.use(require('morgan')('dev'));
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(configs.dbURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Authentication routes
app.use('/auth', require('./server/routes/auth'));

// uptohere
let rooms = {}; // keep track of game rooms

const { v4: uuidv4 } = require("uuid"); // install uuid with: npm install uuid
io.on("connection", (socket) => {
    socket.emit("welcome", "Hello from server!");

    socket.on("connect", () => {
        socket.emit("hello", "I just connected!");
    });

    // Player requests a new room
    socket.on("createRoom", () => {
        const roomId = uuidv4().slice(0, 6); // short unique roomId
        rooms[roomId] = { players: [], board: Array(9).fill(null), currentPlayer: "X" };

        rooms[roomId].players.push(socket.id);
        socket.join(roomId);

        console.log("Room created ", rooms)

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
        console.log("Room Joined", roomId)

        console.log("Total Players", room.players.length)

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
    socket.on("makeMove", (roomId, index, player) => {
        let room = rooms[roomId];
        if (!room) return;

        if (room.board[index] === null && player === room.currentPlayer) {
            room.board[index] = player;
            room.currentPlayer = player === "X" ? "O" : "X";

            io.to(roomId).emit("updateBoard", room.board, room.currentPlayer);

            const result = checkWinner(room.board);
            console.log("Check Winner room.board", room.board);
            console.log("The Result of winner is", result)
            console.log(room.board);
            if (result) {
                io.to(roomId).emit("gameOver", `Player ${result.winner} wins!`, result.winner, result.cells);
            } else if (room.board.every(c => c !== null)) {
                io.to(roomId).emit("gameOver", "It's a draw!", null, []);
            }

        }
    });

});

function checkWinner(board) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], cells: condition }; // return winner + winning cells
        }
    }

    return null;
}

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
