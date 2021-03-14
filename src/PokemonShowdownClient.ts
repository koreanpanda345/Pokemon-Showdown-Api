import { BaseWebSocket } from './websocket';

export class PokemonShowdownClient extends BaseWebSocket {
  constructor(options: {
    server: string;
    ip: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  }) {
    super(options);
  }
}
