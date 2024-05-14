export type IUser = {
  id?: string;
  name?: string;
  gender?: string;
  image?: string;
  health?: number;
  hunger?: number;
  weapon?: object;
  thirst?: number;
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