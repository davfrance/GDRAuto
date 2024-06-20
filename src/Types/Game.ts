import { IClass } from '../Constants/classes';

export interface IStats {
  mana: number;
  attack: number;
  magic: number;
  stamina: number;
}

export interface IUser {
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
}

export interface ITeam {
  id: string;
  members: IUser[];
  name: string;
}

export interface IRelation {
  [playerPrimeMulti: string]: number;
}

export interface ITurn {
  turnNumber: number;
  events: IEvent[];
}

export interface IFightEvent {}

export interface IFightTurn {
  turnNumber: number;
  events: IFightEvent[];
}

export interface IFight {
  participants: [IUser, IUser]; // Two users involved in the fight
  turns: IFightTurn[]; // Array of turns that occur during the fight
  outcome: {
    winner: IUser | null; // Winner of the fight, null if draw
    reason: string; // Reason for the fight outcome
  };
}

export enum EventTypes {
  ATTACK = 'Attack',
  LOOT = 'Loot',
  KINGDOMDROP = 'Kingom Drop',
  TRAVEL = 'Travel',
  ENCOUNTER = 'Encounter',
  RELATION_POSITIVE = 'Positive relation',
  RELATION_NEGATIVE = 'Negative relation',
}

export const IEventsActions = {
  [EventTypes.ATTACK]: { chance: 10, action: {} },
  [EventTypes.LOOT]: { chance: 15, action: {} },
  [EventTypes.KINGDOMDROP]: { chance: 5, action: {} },
  [EventTypes.TRAVEL]: { chance: 30, action: {} },
  [EventTypes.ENCOUNTER]: { chance: 15, action: [{}, {}] },
  [EventTypes.RELATION_POSITIVE]: { chance: 15, action: [{}, {}] },
  [EventTypes.RELATION_NEGATIVE]: { chance: 10, action: [{}, {}] },
};

export interface IEvent {
  type: EventTypes;
  description: string;
  involvedParties: string[];
  involvedPersons: string[];
}

export interface IGame {
  teams: ITeam[];
  id: string;
  relations: IRelation;
  history: ITurn[];
  turn: ITurn;
}
