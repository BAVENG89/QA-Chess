# The application

In this project there is a front and backend to display a chessboard with VueJs, on which two users can play against each other.
Real-time data is transmitted via a native WebSocket server (ws) and scores are saved in a MongoDB. Only a single session is offered
at a time. If a third user opens the app, they can watch the game or quit it.

For the configuration, a file /src/config.ts file is offered for the frontend, for the backend
the file backend/.env

The frontend config contains the uris to the REST API of the backend as well as the uri to the WebSocket Server
```
export const CONFIG_API = 'http://localhost:3000/api/lastsession'
export const CONFIG_WS = 'ws://127.0.0.1:3030'
```

The backend config contains the corresponding configuration as well as the connection uri to MongoDB
```
LISTEN_PORT=3000
SOCKET_PORT=3030
LOG_LEVEL=2
MONGO_URI=mongodb://127.0.0.1:27017
```

Usually this configuration does not have to be adjusted in the development environment. The installation and start of the backend and frontend have not changed and are carried out as described below.

## Requisites:
* NodeJS v14 with npm v6.14 or higher
* Docker v19 or higher
* docker-compose v1.25.5 or higher

Docker and docker-compose are required to run a mongodb (v3.6) instance locally your backend app can connect to, in order to store the chess moves performed by the frontend.

The mongodb instance will export the default port *27017* so you can connect to it on *mongodb://localhost:27017/*

## The Frontend

The user is offered with a Chessboard and a button `Start Session`. If pressed, he gets informed that he has to wait for an opponent to play against.
If a second user opens the app, the is offered buttin `Join Session`. If pressed, the game is started and the first user can make the first move with the white pieces. Here, the Drag and Drop approach was chosen. The user can select one of the white pieces and move it to another field on the board. He can't put his piece on another white piece or a king. If a move is possible, the field is highlighted with green color, if not with red color. If he has finished his move, the opponent can make his move and so on. The users get informed about the state of the game and when it is their turn. If a player makes a move, the piece is animated on the opponents and a visitors app. Anyone of the users can close the session with a click on a button. A short video `chess.mp4` in the root folder of this project illustrates the main features

* Install project dependencies by executing `npm install`
* Start the Vue dev server by executing `npm run serve`

The frontend app consist of a skeleton [Vue.js](https://vuejs.org/) 2.6 app with [Typescript](https://www.typescriptlang.org/) support already included.

The Vue dev server has Hot Module Replacement enabled, so any changes to the files in the `src` directory will trigger recompilation and page refresh in the browser

## The Backend

The Backend offers a single REST endpoint, where an open session can be loaded from. If no open session is found, the endpoint returns HTTP 204 no content. All further communication takes place via the websocket server. Every Session is stored in a single document in the sessions collection of the chess_db Database in MongoDB. The players and moves are stored as sub documents.

* Install project dependencies by executing `npm install`
* Start the mongodb instance and the backend app by executing `npm start`

This will start the database with `docker-compose up`, the typescript compiler in watch mode and `nodemon` watching the `./dist/` directory for changes. The default port for the backend express app is 3000, which you can change in the `nodemonConfig` environment inside the [backend package.json](./backend/package.json). Any changes to files in the `src` directory will trigger a typescript compilation and if changes are detected in the compiled files, a restart of the express app.

## Lints and fixes files
```
npm run lint
```

## Your TASK

### Manual Test suite

* Create a test suite describing the test cases that should be created to ensure the quality of the application

### End-to-End tests

* Write any end-to-end tests that you think are necessary using selenium web driver + a preferred language of yours

### Unit tests

* Write any unit tests that you think are necessary using any preferred by you testing framework among mocha, jest or jasmine

## Deliverable
Please deliver a ZIP file containing the source code and any necessary instructions, but do not include the `node_modules` directory.

-----------------------------------------------------------------------------------------------------------------------------------------

## My TASK: (Changes committed to Frontend folder and added a new folder test-e2e and a file QA Test Plan)

### Manual Test suite

* Can be found in .\QA Test Plan.xlsx

### End-to-End tests

* Can be found in .\tests-e2e\testCafe
* Can be found in .\tests-e2e\cypress\integration

### Unit tests

* Can be found in .\frontend\src\store\Chess\__tests__ 
* To Run: 
            1. Change root directory to ./frontend
            2. npm i
            3. npm test