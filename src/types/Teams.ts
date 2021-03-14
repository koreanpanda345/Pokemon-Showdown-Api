import { start } from 'repl';

export class TeamPokemon {
  constructor(
    private _props: {
      nickname?: string | undefined;
      species: string;
      item?: string | undefined;
      ability: 0 | 1 | 'H' | string;
      moves: string[];
      nature?: string | undefined;
      evs: number[];
      gender?: 'M' | 'F' | undefined;
      ivs: number[];
      shiny?: 'S' | undefined;
      level: number;
      happiness?: number | undefined;
      pokeball?: string | undefined;
      hiddenpowertype?: string | undefined;
    },
  ) {}
  public get props() {
    return this._props;
  }
  // NICKNAME|SPECIES|ITEM|ABILITY|MOVES|NATURE|EVS|GENDER|IVS|SHINY|LEVEL|HAPPINESS,POKEBALL,HIDDENPOWERTYPE
  toString() {
    let pokemon = '';
    if (typeof this._props.nickname === 'undefined') pokemon += `${this._props.species}||`;
    else pokemon += `${this._props.nickname}|${this._props.species}|`;
    pokemon += `${this._props.item || ''}|${this._props.ability}|${this._props.moves.join(',')}|`;
    if (typeof this._props.nature === 'undefined' || this._props.nature === 'Serious')
      pokemon += `|`;
    else pokemon += `${this._props.nature}|`;
    let statstr = '';
    for (const stat of this._props.evs) {
      statstr += `${stat === 0 ? '' : stat},`;
    }
    let arr = statstr.split(',');
    arr.pop();
    pokemon += `${arr.join(',')}|`;
    pokemon += `${typeof this._props.gender === 'undefined' ? '' : this._props.gender}|`;
    statstr = '';
    arr = [];
    for (const stat of this._props.ivs) {
      statstr += `${stat === 31 ? ',' : stat},`;
    }
    arr = statstr.split(',');
    arr.pop();
    pokemon += `${arr.join(',')}|`;
    pokemon += `${typeof this._props.shiny === 'undefined' ? '' : this._props.shiny}|`;
    pokemon += `${this._props.level}|`;
    return pokemon;
  }
}
