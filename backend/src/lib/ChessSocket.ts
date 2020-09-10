import { ChessDB } from './ChessDB'
import WebSocket from 'ws'

export class ChessSocket {
  private connected: boolean = false
  private readonly wss: any
  private readonly database: ChessDB

  public constructor (wss: any, database: ChessDB) {
    this.wss = wss
    this.database = database
  }

  private broadcastOthers (ws: any, data: any): void {
    this.wss.clients.forEach((client: any) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  }

  private broadcast (data: any): void {
    this.wss.clients.forEach((client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  }

  private send (ws: any, data: any): void {
    ws.send(JSON.stringify(data))
  }

  private async startGame (ws: any): Promise<any> {
    const res = await this.database.createSession()
    const head = { action: 'gameStart', sessionId: res._id }

    this.send(ws, Object.assign({ isPlayer: true, playerId: res._player_id }, head))
    this.broadcastOthers(ws, Object.assign({ isPlayer: false }, head))
  }

  private async joinGame (ws: any, sessionId: string): Promise<any> {
    const res = await this.database.joinSession(sessionId)
    const head = { action: 'gameJoin', sessionId: res._id }

    this.send(ws, Object.assign({ isPlayer: true, playerId: res._player_id }, head))
    this.broadcastOthers(ws, Object.assign({ isPlayer: false }, head))
  }

  private async quitGame (ws: any, sessionId: string): Promise<any> {
    const res = await this.database.closeSession(sessionId)

    this.broadcast({ action: 'gameQuit', sessionId: res._id })
    console.log(ws.toString())
  }

  private async pieceMove (ws: any, sessionId: string, playerId: string, from: string, to: string): Promise<any> {
    const res = await this.database.chessMove(sessionId, playerId, from, to)

    this.broadcastOthers(ws, { action: 'pieceMove', sessionId: res._id, from, to })
  }

  public async connect (): Promise<void> {
    this.wss.on('connection', (ws: any) => {
      this.connected = true
      ws.on('message', async (message: any) => {
        const data = JSON.parse(message)

        switch (data.request) {
          case 'startGame':
            await this.startGame(ws)
            break
          case 'joinGame':
            await this.joinGame(ws, data.sessionId)
            break
          case 'quitGame':
            await this.quitGame(ws, data.sessionId)
            break
          case 'pieceMove':
            await this.pieceMove(ws, data.sessionId, data.playerId, data.data.from, data.data.to)
            break
        }
      })
    })
  }

  public async disconnect (): Promise<void> {
    await new Promise(resolve => {
      if (this.connected) {
        this.broadcast({ action: 'serverShutdown' })
        setTimeout(() => resolve(), 5000)
      }
    })
  }
}
