import { ChessStoreInterface, ChessPieceInterface, ChessMoveInterface } from '../../interfaces/Chess'

class ChessRules {
  isKing (to?: ChessPieceInterface): boolean {
    if (to) {
      return to.name === 'k'
    }
    return false
  }

  isOwn (from?: ChessPieceInterface, to?: ChessPieceInterface): boolean {
    if (from && to) {
      return from.color === to.color
    }
    return false
  }

  isSame (data: ChessMoveInterface): boolean {
    return data.from === data.to
  }

  validateMove (state: ChessStoreInterface, data: ChessMoveInterface): boolean {
    const from = state.pieces.find((piece: ChessPieceInterface) => piece.pos === data.from)
    const to = state.pieces.find((piece: ChessPieceInterface) => piece.pos === data.to)

    if (this.isKing(to)) return true

    if (this.isOwn(from, to)) return false

    return true
  }
}

export default new ChessRules()
