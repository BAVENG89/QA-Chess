import { MongoClient, ObjectID } from 'mongodb'

export class ChessDB {
  private readonly client: MongoClient
  private connected: boolean = false
  private db: any

  public constructor (client: MongoClient) {
    this.client = client
  }

  private createObjectID (): string {
    return String(new ObjectID())
  }

  public async createSession (): Promise<any> {
    const id = this.createObjectID()
    const playerId = this.createObjectID()

    await this.db.collection('sessions').insertOne({
      _id: id,
      started: true,
      pending: true,
      players: [{ _player_id: playerId, timestamp: Date.now(), color: 'w' }],
      moves: [],
      started_at: Date.now()
    })

    return { _id: id, _player_id: playerId }
  }

  public async joinSession (id: string): Promise<any> {
    const playerId = this.createObjectID()

    await this.db.collection('sessions').updateOne({ _id: id }, {
      $addToSet: {
        players: { _player_id: playerId, TimeStamp: Date.now(), color: 'b' }
      },
      $set: {
        pending: false,
        updated_at: Date.now()
      }
    })

    return { _id: id, _player_id: playerId }
  }

  public async chessMove (id: string, playerId: string, from: string, to: string): Promise<any> {
    await this.db.collection('sessions').updateOne({ _id: id }, {
      $addToSet: {
        moves: { _player_id: playerId, from, to, timestamp: Date.now() }
      },
      $set: {
        updated_at: Date.now()
      }
    })

    return { _id: id }
  }

  public async closeSession (id: string): Promise<any> {
    await this.db.collection('sessions').updateOne({ _id: id }, {
      $set: {
        started: false,
        pending: false,
        closed_at: Date.now()
      }
    })

    return { _id: id }
  }

  public async findSession (): Promise<any> {
    const result = await this.db.collection('sessions').find({ started: true }).sort([['started_at', -1]]).limit(1).toArray()
    return result[0]
  }

  public async connect (): Promise<void> {
    try {
      await this.client.connect()
      this.connected = true

      this.db = this.client.db('chess_db')

      const hasSessionCollection = await this.db.listCollections({ name: 'sessions' }).toArray()

      if (hasSessionCollection.length < 1) {
        await this.db.createCollection('sessions')
      }
    } catch (ex) {
      this.connected = false
      throw ex
    }
  }

  public async disconnect (): Promise<void> {
    if (this.connected) {
      const openSessions = await this.db.collection('sessions').find({ started: true }).sort([['started_at', -1]]).limit(1).toArray()
      for (const session of openSessions) {
        await this.closeSession(session._id)
      }
      await this.client.close()
    }
  }
}
