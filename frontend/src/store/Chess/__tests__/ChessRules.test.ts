import ChessRules from '../ChessRules'
import state from '../../../fixture/state'

const pawn = {
  color: 'w',
  key: 'p16',
  name: 'p',
  pos: 'a3'
}

const king = {
  color: 'w',
  key: 'k28',
  name: 'k',
  pos: 'e2'
}

describe('ChessRules Test', () => {
  it('isKing: A pawn should return false', () => {
    const isKing = ChessRules.isKing(pawn)
    expect(isKing).toEqual(false)
  })

  it('isKing: A king should return true', () => {
    const isKing = ChessRules.isKing(king)
    expect(isKing).toEqual(true)
  })

  it('isOwn: opponent pieces should return false', () => {
    const from = {
      color: 'b',
      key: 'k28',
      name: 'k',
      pos: 'e2'
    }
    const to = {
      color: 'w',
      key: 'k28',
      name: 'k',
      pos: 'e2'
    }
    const isOwn = ChessRules.isOwn(from, to)
    expect(isOwn).toEqual(false)
  })

  it('isOwn: same pieces should return true', () => {
    const from = {
      color: 'w',
      key: 'k28',
      name: 'k',
      pos: 'e2'
    }
    const to = {
      color: 'w',
      key: 'k28',
      name: 'k',
      pos: 'e2'
    }
    const isOwn = ChessRules.isOwn(from, to)
    expect(isOwn).toEqual(true)
  })

  it('validateMove: Piece is allowed to move on the board', () => {
    const data = { from: 'd2', to: 'd3' }
    const isValidMove = ChessRules.validateMove(state, data)
    expect(isValidMove).toEqual(true)
  })

  it('validateMove: Piece is allowed to move to free square', () => {
    const data = { from: 'a2', to: 'a3' }
    const isValidMove = ChessRules.validateMove(state, data)
    expect(isValidMove).toEqual(true)
  })

  it('validateMove: Piece is allowed to move to a square where opponent’s piece is placed', () => {
    const data = { from: 'a2', to: 'a7' }
    const isValidMove = ChessRules.validateMove(state, data)
    expect(isValidMove).toEqual(true)
  })

  it('validateMove: Piece is NOT allowed to move to a square where own piece is placed', () => {
    const data = { from: 'a2', to: 'a1' }
    const isValidMove = ChessRules.validateMove(state, data)
    expect(isValidMove).toEqual(false)
  })

  it('validateMove: Piece is NOT allowed to move to a square where its own king is placed', () => {
    const data = { from: 'e2', to: 'e1' }
    const isValidMove = ChessRules.validateMove(state, data)
    expect(isValidMove).toEqual(false)
  })

  it('validateMove: Piece is NOT allowed to move off the board', () => {
    const data = { from: 'a2', to: 'z3' }
    const isValidMove = ChessRules.validateMove(state, data)
    expect(isValidMove).toEqual(false)
  })
})
