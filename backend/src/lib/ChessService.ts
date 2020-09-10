import express, { Request, Response, Router } from 'express'
import { ChessDB } from './ChessDB'

export const ChessService = (database: ChessDB): Router => {
  const router = Router()
  router.use(express.json())

  router.get('/api/lastsession', async (req: Request, res: Response) => {
    const result = await database.findSession()
    if (result === undefined) {
      res.status(204).send('No Content')
    } else {
      res.json(result)
    }
    console.log(req)
  })

  return router
}
