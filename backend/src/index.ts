import express from 'express'
import cors from 'cors'
import WebSocket from 'ws'

import { MongoClient } from 'mongodb'

import { ChessDB } from './lib/ChessDB'
import { ChessService } from './lib/ChessService'
import { ChessSocket } from './lib/ChessSocket'

import { LISTEN_PORT, SOCKET_PORT, LOG_LEVEL, MONGO_URI } from './config'

process.stdin.resume()

const main = async () => {
  const client = new MongoClient(MONGO_URI, {
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  })

  const database = new ChessDB(client)
  await database.connect()

  const app = express()
  app.use(cors())
  app.use(ChessService(database))

  const wss = new WebSocket.Server({ port: SOCKET_PORT })
  const socket = new ChessSocket(wss, database)
  await socket.connect()

  app.listen(LISTEN_PORT, () => {
    if (LOG_LEVEL > 1) console.log(`Server listening on port ${LISTEN_PORT}`)
  })

  const onExit = async () => {
    if (LOG_LEVEL > 1) console.log(`Teardown`)

    await socket.disconnect()
    await database.disconnect()

    if (LOG_LEVEL > 1) console.log(`Exit`)

    process.exit();
  }

  process.on('SIGUSR1', onExit);
  process.on('SIGUSR2', onExit);
  process.on('SIGTERM', onExit);
  process.on('SIGINT', onExit);
}

main()
