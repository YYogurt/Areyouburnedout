export interface IMessage {
  _id?: string;
  nickname?: string;
  content: string;
  color: string;
  starSize: number;
  posX: number;
  posY: number;
  createdAt: Date;
}

export interface StarPosition {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleDelay: number;
  twinkleDuration: number;
}
