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

// New types for structured descriptions
export type DescriptionSegmentType = 'text' | 'team' | 'user';
export interface IDescriptionSegment {
  type: DescriptionSegmentType;
  value: string;
  id?: string; // Optional ID for teams or users for potential interactions
}

export interface IEvent {
  type: EventTypes;
  teamId: string;
  description: IDescriptionSegment[]; // Changed from string
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
  description: IDescriptionSegment[]; // Changed from string
  involvedParties: string[];
  involvedPersons: string[];
}

export interface ITurn {
  turnNumber: number;
  events: ITurnEvent[];
}

export interface IGame {
  id: string;
  teams: ITeam[];
  defeatedTeams?: ITeam[];
  relations: IRelation;
  history: ITurn[];
  turn: ITurn;
  prime?: number;
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
export type IEventsActions = Record<
  Exclude<
    EventTypes,
    EventTypes.RELATION_NEGATIVE | EventTypes.RELATION_POSITIVE
  >,
  IEventActionObject
>;
export const EventPossibilities: IEventsActions = {
  [EventTypes.ATTACK]: { chance: 15, action: {} },
  [EventTypes.LOOT]: { chance: 15, action: {} },
  [EventTypes.KINGDOMDROP]: { chance: 5, action: {} },
  [EventTypes.TRAVEL]: { chance: 50, action: {} },
  [EventTypes.ENCOUNTER]: { chance: 15, action: [{}, {}] },
};
