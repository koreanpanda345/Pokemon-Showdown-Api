import { TeamPokemon } from './Teams';

export class Battle {
  private _turn: number = 0;
  private _side: {
    [key: string]: {
      name: string;
      inflictor: string;
    }[];
  } = {};
  private _teams: { [key: string]: TeamPokemon[] } = {};
  private _weather: { weather: string; inflictor: string } = { weather: '', inflictor: '' };
  constructor(private _battleId: string, private _player1: string, private _player2: string) {
    this._side.p1 = [];
    this._teams.p1 = [];
    this._side.p2 = [];
    this._teams.p2 = [];
  }
  public addPokemon = (side: string, pokemon: TeamPokemon) => this._teams[side].push(pokemon);
  public nextTurn = () => this._turn++;
  public addHazards = (side: string, hazard: string, inflictor: string) => {
    if (side !== '') this._side[side].find((x) => x!.name === hazard)!.inflictor! = inflictor;
  };

  public endHazards = (side: string, hazard: string) =>
    this._side[side].splice(
      this._side[side].findIndex((x) => x!.name === hazard),
      1,
    );
  public setWeather = (weather: string, inflictor: string) =>
    (this._weather = { weather, inflictor });
  public clearWeather = () => (this._weather = { weather: '', inflictor: '' });
}
