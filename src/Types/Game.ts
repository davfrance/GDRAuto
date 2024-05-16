import { IClass } from '../Constants/classes';

export type IUser = {
  id: string;
  name: string;
  gender?: string;
  image?: string;
  weapon?: object;
  hunger: number;
  thirst: number;
  hp: number;
  class?: IClass;
  stats: IStats;
  prime: number;
};

export interface ITeam {
  id: string;
  members: IUser[];
  name: string;
}

export interface IGame {
  teams: ITeam[];
  id: string;
  relations: IRelation;
}

export interface IRelation {
  [playerPrimeMulti: string]: number;
}

export interface IStats {
  mana: number;
  attack: number;
  magic: number;
  stamina: number;
}
