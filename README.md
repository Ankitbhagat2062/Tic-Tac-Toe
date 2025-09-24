# Tic-Tac-Toe Backend

A robust Node.js backend API for the Tic-Tac-Toe game, providing real-time multiplayer functionality, user authentication, and game state management. Built with Express.js and Socket.io for seamless real-time communication.

## Features

### 🎮 Real-time Multiplayer
- **Socket.io Integration**: Real-time game synchronization across multiple clients
- **Room Management**: Create and join game rooms with unique identifiers
- **Live Game Updates**: Instant move synchronization and game state updates
- **Cross-device Compatibility**: Play with friends on different devices

### 🔐 Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth 2.0**: Social login integration via Passport.js
- **User Management**: Secure user registration and login system
- **Session Management**: Persistent user sessions with secure cookies

### 🛠️ Technical Features
- **RESTful API**: Well-structured API endpoints for game and user management
- **MongoDB Integration**: NoSQL database with Mongoose ODM
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Request Logging**: Morgan middleware for comprehensive request logging
- **Environment Configuration**: Secure configuration management with dotenv

### 📊 Game Management
- **Game State Persistence**: Save and restore game states
- **Win Detection**: Automatic win/draw detection with winning line identification
- **Room Cleanup**: Automatic cleanup of inactive game rooms
- **Player Assignment**: Dynamic player symbol assignment (X/O)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ankitbhagat2062/Tic-Tac-Toe.git
   cd tic-tac-toe
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/tictactoe
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   SESSION_SECRET=your-session-secret
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```

5. **Start the frontend (in another terminal)**:
   ```bash
   npm run dev
   ```

## Usage

### Starting the Server
```bash
# Development mode with auto-restart
npm start

# Or run directly
node server.js
```

The server will start on `http://localhost:3000` by default.

### API Endpoints

#### Authentication Routes (`/auth`)
- `POST /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile (protected)
- `POST /auth/logout` - User logout

#### Socket.io Events
- `connection` - Client connected
- `createRoom` - Create a new game room
- `joinGame` - Join an existing game room
- `makeMove` - Make a move on the board
- `newGame` - Start a new game in the same room
- `disconnect` - Handle client disconnection

### Game Flow

1. **Room Creation**:
   - Player creates a room and gets a unique room ID
   - First player is automatically assigned symbol "X"

2. **Room Joining**:
   - Second player joins using the room ID
   - Second player is assigned symbol "O"
   - Game starts automatically when both players are connected

3. **Gameplay**:
   - Players make moves by emitting `makeMove` events
   - Server validates moves and updates game state
   - Win/draw conditions are automatically detected
   - Game state is broadcasted to all players in the room

4. **Game End**:
   - Winner is announced with winning line highlight
   - Players can start a new game in the same room
   - Room persists until all players disconnect

## Technologies Used

### Backend Framework
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Real-time Engine**: Socket.io

### Database & Storage
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs

### Authentication & Security
- **OAuth Provider**: Google OAuth 2.0
- **Strategy**: Passport.js
- **Session Management**: Express sessions
- **CORS**: Cross-origin resource sharing

### Development Tools
- **Process Management**: Nodemon (auto-restart)
- **Environment Config**: dotenv
- **Request Logging**: Morgan
- **CORS Middleware**: cors
- **Unique IDs**: uuid

## Project Structure

```
├── server.js                 # Main server file and Socket.io setup
├── server/
│   ├── configs/
│   │   └── config.js         # Database and environment configuration
│   ├── Fetch/
│   │   └── auth.js           # Authentication helper functions
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── models/
│   │   └── User.js           # User data model
│   ├── passport/
│   │   └── passport.js       # Passport OAuth configuration
│   └── routes/
│       └── auth.js           # Authentication routes
├── package.json              # Dependencies and scripts
├── .env                       # Environment variables (create this)
└── README.md                 # This file
```

## Dependencies

Key packages from `package.json`:
- `express`: Web framework for Node.js
- `socket.io`: Real-time bidirectional communication
- `mongoose`: MongoDB object modeling
- `jsonwebtoken`: JWT implementation
- `bcryptjs`: Password hashing
- `passport`: Authentication middleware
- `passport-google-oauth20`: Google OAuth strategy
- `cors`: Cross-origin resource sharing
- `morgan`: HTTP request logger
- `dotenv`: Environment variable management
- `uuid`: Unique identifier generation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (defaults to 3000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `SESSION_SECRET` | Secret for session management | Yes |

## Development

### Running in Development Mode
```bash
npm start
```

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The app will automatically create necessary collections

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add callback URL: `http://localhost:3000/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

## API Documentation

### Socket.io Events

#### Client to Server Events
- `createRoom`: Create a new game room
- `joinGame`: Join an existing game room with room ID
- `makeMove`: Make a move at specific board position
- `newGame`: Start a new game in current room

#### Server to Client Events
- `roomCreated`: Returns the created room ID
- `playerAssignment`: Assigns player symbol (X or O)
- `updateBoard`: Updates the game board state
- `startGame`: Notifies when game starts
- `gameOver`: Announces game end with result
- `errorMessage`: Sends error messages
- `forceRefresh`: Forces client refresh on disconnection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [ISC License](LICENSE).

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Note**: This backend works in conjunction with the React frontend. Make sure both frontend and backend are running for full functionality.
