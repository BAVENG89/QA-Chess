export interface ChessPieceInterface {
  key: string;
  pos: string;
  name: string;
  color: string;
}

export interface ChessImagesInterface {
  [key: string]: string;
  br: string;
  bn: string;
  bb: string;
  bq: string;
  bk: string;
  bp: string;
  wr: string;
  wn: string;
  wb: string;
  wq: string;
  wk: string;
  wp: string;
}

export interface ChessFieldInterface {
  key: string;
  pos: string;
}

export interface ChessGameInterface {
  sessionId?: string;
  started: boolean;
  pending: boolean;
}

export interface ChessPlayerInterface {
  playerId?: string;
  color?: string;
  isPlayer: boolean;
  isVisitor: boolean;
}

export interface SocketInterface {
  isConnected: boolean;
  isShutdown: boolean;
  reconnectError: boolean;
}

export interface ChessMoveInterface {
  from: string;
  to: string;
}

export interface ChessStoreInterface {
  pieces: ChessPieceInterface[];
  fields: ChessFieldInterface[];
  lastPiece: string;
  movingPiece: string;
  game: ChessGameInterface;
  player: ChessPlayerInterface;
}

export interface SocketGameInterface {
  action: string;
  sessionId: string;
  isPlayer: boolean;
  playerId: string;
}

export interface SocketMoveInterface {
  action: string;
  sessionId: string;
  from: string;
  to: string;
}
