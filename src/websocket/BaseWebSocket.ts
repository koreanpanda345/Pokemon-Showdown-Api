import * as ws from 'ws';
import { stringify } from 'querystring';
import axios from 'axios';
import { EventEmitter } from 'events';
import { Messages } from './../types/Messages';

export class BaseWebSocket extends EventEmitter {
  private _ws: ws;

  constructor(
    private _options: {
      server: string;
      ip: string;
      port: number;
      credentials: {
        username: string;
        password: string;
      };
    },
  ) {
    super();
    const url = `${_options.ip}:${_options.port}`;
    this._ws = new ws(`ws://${url}/showdown/websocket`);
  }

  private async login(nonce: string) {
    const url = `https://play.pokemonshowdown.com/~~${this._options.server}/action.php`;
    const data = stringify({
      act: 'login',
      name: this._options.credentials.username.replace(' ', '').toLowerCase(),
      pass: this._options.credentials.password,
      challstr: nonce,
    });
    const response = await axios.post(url, data);
    let json;
    try {
      json = JSON.parse((response.data as string).substring(1));
    } catch (error) {
      throw new Error(error);
    }
    return json;
  }

  private async processCommand(data: string) {
    if (data.includes('|challstr|')) {
      const line = data.split('|challstr|')[1];
      const nonce = line;

      const client = await this.login(nonce);
      const assertion = client.assertion;
      if (assertion) {
        this._ws.send(`|/trn ${this._options.credentials.username},0,${assertion}|`, (error) => {
          if (error) throw new Error(error.message);
        });
        this.emit('ready', { client });
      }
    } else if (data.includes('|noinit|')) {
      const args = data.split('|');
      this.emit('noinit', args);
    } else if (data.includes('|updateuser|')) {
      const args = data.split('|');
      this.emit('updateuser', args);
    } else if (data.includes('|init|')) {
      const args = data.split('|');
      this.emit('init', args);
    } else if (data.includes('|battle|')) {
      const args = data.split('|');
      this.emit('battle', args);
    } else if (data.includes('|pm|')) {
      const args = data.split('|');
      this.emit('message', new Messages(this, args[4], args[2], args[3]));
    }
  }

  async connect() {
    this._ws.on('open', (_: WebSocket) => {
      this._ws.on('message', async (data: string) => {
        await this.processCommand(data);
      });
    });
  }
  async requestReplay(data: { id: string; log: string }) {
    const url = `https://play.pokemonshowdown.com/~~${this._options.server}/action.php`;
    data.id = `${this._options.server === 'showdown' ? '' : `${this._options.server}-`}${data.id}`;
    const newData = stringify({
      act: 'uploadreplay',
      log: data.log,
      id: data.id,
    });

    const response = await axios.post(url, newData);
    const replay = `https://replay.pokemonshowdown.com/${data.id}`;

    return replay;
  }

  async joinBattle(battleId: string) {
    const cmd = `|/join ${battleId}`;
    this._ws.send(cmd, (error) => {
      if (error) throw new Error(error.message);
      this._ws.on('message', (data: string) => {
        const battleLines = [
          '|j|',
          '|l|',
          '|t:|',
          '|player|',
          '|teamsize|',
          '|gametype|',
          '|gen|',
          '|tier|',
          '|rule|',
          '|start',
          '|switch|',
          '|turn|',
          '|move|',
          '|-status|',
          '|-damage|',
          '|upkeep',
          '|-heal|',
          '|-sidestart|',
          '|-boost|',
          '|-ability|',
          '|-miss|',
          '|-resisted|',
          '|-supereffective|',
          '|drag|',
          '|-unboost|',
          '|-singleturn|',
          '|faint|',
          '|-fieldstart',
          '|-sideend',
          '|-fieldend',
          '|-activate',
          '|win|',
          '|c|',
        ];
        for (const line of data.split('\n')) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < battleLines.length; i++) {
            if (line.startsWith(battleLines[i])) {
              this.emit('battle', line);
            }
          }
        }
      });
    });
  }

  async leaveBattle(battleId: string) {
    const cmd = `|/leave ${battleId}`;
    this._ws.send(cmd, (error) => {
      if (error) throw new Error(error.message);
      this.removeAllListeners('battle');
    });
  }

  async sendMessage(user: string, content: string) {
    const cmd = `|/msg ${user}, ${content}`;

    this._ws.send(cmd, (error) => {
      if (error) throw new Error(error.message);
    });
  }
}
