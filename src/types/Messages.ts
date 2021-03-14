import { BaseWebSocket } from '../websocket';

export class Messages {
  constructor(
    private _ws: BaseWebSocket,
    private _content: string,
    private _by: string,
    private _to: string,
    private _room?: string,
  ) {}
  public get ws() {
    return this._ws;
  }
  public get content() {
    return this._content;
  }
  public get by() {
    return this._by;
  }
  public get to() {
    return this._to;
  }
  public get room() {
    return this._room;
  }

  public async send(to: string, content: string) {
    await this._ws.sendMessage(to, content);
  }
}
