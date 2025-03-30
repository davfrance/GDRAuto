import { IClass } from '../Constants/classes';
import { IWeapon } from './Weapons';

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
  weapon?: IWeapon;
  hunger: number;
  thirst: number;
  hp: number;
  class?: IClass;
  stats: IStats;
}

export interface ITeam {
  id: string;
  members: IUser[];
  name: string;
  prime: number;
}

export interface IRelation {
  [playerPrimeMulti: string]: number;
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
export interface IEvent {
  type: EventTypes;
  description: string;
  involvedParties: string[];
  involvedPersons: string[];
  lootedWeapon?: IWeapon | null;
}
export interface ITurnEvent {
  teamId: string;
  memberId: string;
  action: IEvent;
  timestamp: string;
  type: EventTypes;
  description: string;
  involvedParties: string[];
  involvedPersons: string[];
}

export interface ITurn {
  turnNumber: number;
  events: ITurnEvent[];
}

export interface IGame {
  teams: ITeam[];
  id: string;
  relations: IRelation;
  history: ITurn[];
  turn: ITurn;
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

export interface IEventActionObject {
  chance: number;
  action: object | object[]; // Adjust the type based on the actual structure of action
}
export type IEventsActions = Record<EventTypes, IEventActionObject>;
export const EventPossibilities: IEventsActions = {
  [EventTypes.ATTACK]: { chance: 10, action: {} },
  [EventTypes.LOOT]: { chance: 15, action: {} },
  [EventTypes.KINGDOMDROP]: { chance: 5, action: {} },
  [EventTypes.TRAVEL]: { chance: 30, action: {} },
  [EventTypes.ENCOUNTER]: { chance: 15, action: [{}, {}] },
  [EventTypes.RELATION_POSITIVE]: { chance: 15, action: [{}, {}] },
  [EventTypes.RELATION_NEGATIVE]: { chance: 10, action: [{}, {}] },
};
