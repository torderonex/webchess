# WebChess - Online Chess Platform

WebChess is an online chess platform that allows users to play chess with friends or opponents from around the world. This project combines various technologies, including TypeScript, React, Mobx, Golang, Rest-API, Websockets, JWT authentication, and PostgreSQL, to create a seamless and enjoyable chess-playing experience. Additionally, WebChess integrates a custom-built chess engine for accurate gameplay.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

WebChess offers a range of features for chess enthusiasts, including:

- **Real-time Gameplay:** Play chess games in real-time with other users.
- **Custom Chess Engine:** A custom-built chess engine for accurate and challenging gameplay.
- **User Accounts:** Register, login, and manage your user account.
- **Ranking System:** Keep track of your performance with a ranking system.
- **Chat (in dev):** Communicate with your opponent during the game.

## Technologies

WebChess is built using the following technologies:

- **Frontend**:
  - TypeScript
  - React
  - Mobx for state management
  - Websockets for real-time communication

- **Backend**:
  - Golang for server-side logic
  - Rest-API for user authentication and game management
  - Websockets for real-time game updates
  - JWT authentication for secure user login
  - PostgreSQL for database storage

## Installation

To run WebChess locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/torderonex/webchess.git
   ```

2. Navigate to the project directory:

   ```bash
   cd webchess
   ```

3. Install the frontend dependencies:

   ```bash
   cd client
   npm install
   npm start
   ```

4. Install the backend dependencies:

   ```bash
   cd ../server
   go mod tidy
   
   ```

5. Set up the config file in ./server/config/config.yaml.

   ```yaml
   postgres:
      HOST: 
      PORT: 
      USERNAME: 
      DBNAME: 
      SSLMODE: 
    EMAIL:
      SMTP_PORT: 
      USERNAME: 
      SERVER: 
      
    CLIENT_DOMAIN: localhost
    CLIENT_PORT: 3000
    CLIENT_URL: http://localhost:3000

    SERVER_URL: http://localhost:8080
    
   ```
   Set up the .env file in ./server/.env
    ```.env
    DB_PASSWORD = 
    SIGNING_KEY_REFRESH = 
    SIGNING_KEY_ACCESS = 
    SALT = 
    EMAIL_PASSWORD = 
    ```
6. Start the frontend and backend servers in separate terminals:

   Frontend:

   ```bash
   cd client
   npm start
   ```

   Backend:

   ```bash
   cd server
   cd /cmd/main
   go build main.go
   ./main.exe
   ```

7. Access WebChess in your browser at `http://localhost:3000`.

## Usage

1. Register for an account on the WebChess platform and verify account with email.

2. Login with your credentials.

3. Start a new game or join to a friend's game lobby.

4. Play chess in real-time.

5. Keep track of your ranking and improve your chess skills.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.