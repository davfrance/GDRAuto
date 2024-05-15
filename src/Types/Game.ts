import { IClass } from "../Constants/classes";

export type IUser = {
  id: string;
  name: string;
  gender?: string;
  image?: string;
  hunger: number;
  weapon?: object;
  thirst: number;
  hp: number;
  class?: IClass;
  stats:IStats
};
export interface ITeam {
  id: string;
  members: IUser[];
  name: string;
}
export interface IGame {
  teams: ITeam[];
  id:string
}
export interface IStats{
  mana: number,
  attack: number,
  magic: number,
  stamina: number,
}