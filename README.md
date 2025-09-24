# Tic-Tac-Toe Game

A modern, interactive Tic-Tac-Toe game built with React and Vite, featuring both classic and customizable gameplay modes, real-time online multiplayer, and engaging audio-visual effects.

## Features

### 🎮 Game Modes
- **Classic Mode**: Traditional 3x3 Tic-Tac-Toe gameplay
- **Custom Mode**:
  - Adjustable board sizes from 3x3 up to 8x8
  - Customizable win conditions (3 to 5 in a row)
  - Flexible gameplay for different skill levels

### 🌐 Multiplayer Options
- **Online Play**: Real-time multiplayer with friends across different devices using Socket.io
  - Create or join game rooms
  - Cross-device compatibility
- **Offline Modes**:
  - Human vs Human (local multiplayer)
  - Human vs AI (computer opponent)

### 🎵 Audio & Visual Experience
- **Sound Effects**: Background music, click sounds, win/lose/draw audio feedback
- **Animations**: Smooth transitions and victory line animations using Framer Motion
- **Responsive Design**: Optimized for desktop and mobile devices with Tailwind CSS

### 🛠️ Technical Features
- **State Management**: Redux Toolkit and Zustand for efficient game state handling
- **Real-time Communication**: Socket.io for seamless online multiplayer
- **Toast Notifications**: User feedback for game events
- **Modular Architecture**: Clean component structure with reusable UI elements

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ankitbhagat2062/Tic-Tac-Toe.git
   cd tic-tac-toe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   VITE_API_URL=your-backend-api-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Starting a Game
1. **Select Game Mode**:
   - Choose "Classic" for standard 3x3 gameplay
   - Choose "Custom" to set your own board size and win conditions

2. **Choose Opponent**:
   - **AI**: Play against computer opponent
   - **Offline**: Local human vs human
   - **Online**: Create or join a room for multiplayer

3. **Gameplay**:
   - Click on empty cells to make moves
   - The game automatically detects wins, draws, and switches turns
   - Use the "New Game" button to start over

### Online Multiplayer
1. Click "Create Room" to host a game
2. Share the Room ID with a friend
3. They can join using the Room ID
4. Start playing in real-time!

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit, Zustand
- **Real-time Communication**: Socket.io-client
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons, Heroicons
- **UI Components**: Headless UI
- **Notifications**: React Toastify

## Dependencies

Key packages from `package.json`:
- `@reduxjs/toolkit`: State management
- `socket.io-client`: Real-time multiplayer
- `framer-motion`: Animations
- `react-router-dom`: Navigation
- `tailwindcss`: Styling
- `zustand`: Lightweight state management
- `react-toastify`: Notifications

## Project Structure

```
src/
├── Components/          # React components
│   ├── Home.jsx        # Main game interface
│   ├── TicTacToe.jsx   # Game board component
│   └── ...
├── store/              # State management
├── services/           # API and socket services
├── hooks/              # Custom React hooks
├── context/            # React context providers
└── assets/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Screenshots

*Add screenshots of the game in different modes here*

## Support

For issues or questions, please open an issue on GitHub.
