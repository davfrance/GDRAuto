import {
  DEFAULT_HP,
  PARTIES_NAMES,
  PRIME_NUMBERS,
  USERS_NAMES,
} from '../Constants';
import { IClass, IClasses, classes } from '../Constants/classes';
import { getRandomWeapon } from '../Constants/weapons';
import {
  EventPossibilities,
  EventTypes,
  IEvent,
  IGame,
  IRelation,
  IStats,
  ITeam,
  ITurn,
  IUser,
} from '../Types/Game';
import {
  createMultiTeamEvent,
  isTeamInBlockingAction,
} from './teamInteractions';

import { updateRelationsMap } from '../Redux/Slices/Game';
import { IWeapon, WeaponType } from '../Types/Weapons';
import { Dispatch } from '@reduxjs/toolkit';

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDefaultStats() {
  const stats: IStats = {
    mana: Math.floor(Math.random() * 7) + 4,
    attack: Math.floor(Math.random() * 7) + 4,
    magic: Math.floor(Math.random() * 7) + 4,
    stamina: Math.floor(Math.random() * 7) + 4,
  };

  const statKeys = Object.keys(stats);
  const maxStat = statKeys.reduce(
    (max, key) =>
      stats[key as keyof IStats] > max ? stats[key as keyof IStats] : max,
    0
  );
  if (maxStat < 10) {
    const randomKey = statKeys[Math.floor(Math.random() * statKeys.length)];
    stats[randomKey as keyof IStats] = 10;
  }

  return stats;
}
export function addClassStats(
  stats: IStats,
  hp: number,
  userClass: IClass
): { newStats: IStats; newHP: number } {
  const newStats = { ...stats };
  newStats.mana += userClass.stats.mana;
  newStats.attack += userClass.stats.attack;
  newStats.magic += userClass.stats.magic;
  newStats.stamina += userClass.stats.stamina;
  const newHP = hp + userClass.stats.hp;
  Object.keys(newStats).forEach(key => {
    if (stats[key as keyof IStats] <= 0) {
      stats[key as keyof IStats] = 1;
    }
  });
  return { newStats, newHP };
}
export function generateRelationsMap(teams: ITeam[]): IRelation {
  const relations: IRelation = {};

  teams.forEach(team => {
    const primeNumber = team.prime;
    teams.forEach(secondTeam => {
      const secondPrimeNumber = secondTeam.prime;
      if (primeNumber != secondPrimeNumber)
        relations[primeNumber * secondPrimeNumber] = 50;
    });
  });
  return relations;
}
export function getUserPrimeNumber(teams: ITeam[]): number {
  return PRIME_NUMBERS[teams.length];
}
function generateRandomUser(alreadyUsedNames: string[]): IUser {
  const user: IUser = {
    id: uuidv4(),
    name: '',
    hunger: 10,
    thirst: 10,
    hp: 0,
    stats: {
      mana: 0,
      attack: 0,
      magic: 0,
      stamina: 0,
    },
    weapon: undefined,
    class: undefined,
  };
  let found = false;
  while (found == false) {
    const randNumForName = Math.floor(Math.random() * 50);
    if (!alreadyUsedNames.includes(USERS_NAMES[randNumForName])) {
      user.name = USERS_NAMES[randNumForName];
      found = true;
    }
  }
  const baseStats = getDefaultStats();
  const userClass =
    classes[
      Object.keys(classes)[
        Math.floor(Math.random() * Object.keys(classes).length)
      ] as keyof IClasses
    ];
  const { newStats, newHP } = addClassStats(baseStats, DEFAULT_HP, userClass);
  user.stats = newStats;
  user.hp = newHP;
  user.class = userClass;
  return user;
}
export function generateMissingTeams(gameState: IGame | null): ITeam[] {
  const missingTeams = 8 - (gameState?.teams?.length ?? 0);
  const newTeams: ITeam[] = [];
  const usedNames = [];
  const alreadyUsedTeamNames = gameState?.teams.map(team => team.name) ?? [];
  for (let i = 0; i < missingTeams; i++) {
    const teamMembers: IUser[] = [];
    const firstMember = generateRandomUser(usedNames);
    usedNames.push(firstMember.name);
    const secondMember = generateRandomUser(usedNames);
    teamMembers.push(firstMember, secondMember);
    let teamName = '';
    while (teamName === '') {
      const randNumForName = Math.floor(Math.random() * PARTIES_NAMES.length);
      if (!alreadyUsedTeamNames.includes(PARTIES_NAMES[randNumForName])) {
        teamName = PARTIES_NAMES[randNumForName];
      }
    }
    alreadyUsedTeamNames.push(teamName);
    const newTeam: ITeam = {
      id: uuidv4(),
      members: [firstMember, secondMember],
      name: teamName,
      prime: getUserPrimeNumber([...(gameState?.teams ?? []), ...newTeams]),
    };
    newTeams.push(newTeam);
  }
  return newTeams;
}

// Function to determine which team member would benefit most from a weapon
export function getBestMemberForWeapon(team: ITeam, weapon: IWeapon): IUser {
  // Default to first member if there's only one
  if (team.members.length === 1) {
    return team.members[0];
  }

  // Calculate a score for each member based on their stats and the weapon type
  const memberScores = team.members.map(member => {
    let score = 0;

    // Score based on weapon type
    switch (weapon.type) {
      // Magic weapons (Staff, Wand) - prioritize members with high mana and magic
      case WeaponType.STAFF:
      case WeaponType.WAND:
        score += member.stats.mana * 2;
        score += member.stats.magic * 2;
        break;

      // Ranged weapons (Bow) - prioritize members with high stamina
      case WeaponType.BOW:
        score += member.stats.stamina * 1.5;
        break;

      // Heavy weapons (Axe, Mace) - prioritize members with high attack
      case WeaponType.AXE:
      case WeaponType.MACE:
        score += member.stats.attack * 2;
        break;

      // Light weapons (Dagger) - balanced between attack and stamina
      case WeaponType.DAGGER:
        score += member.stats.attack * 1.2;
        score += member.stats.stamina * 1.2;
        break;

      // Medium weapons (Sword, Spear) - balanced stats
      case WeaponType.SWORD:
      case WeaponType.SPEAR:
      default:
        score += member.stats.attack * 1.5;
        score += member.stats.stamina * 0.8;
        break;
    }

    // Consider class weapon proficiencies if available
    if (member.class) {
      switch (weapon.type) {
        case WeaponType.SWORD:
        case WeaponType.DAGGER:
        case WeaponType.AXE:
          score += member.class.weaponsStats.oneHand * 0.5;
          break;
        case WeaponType.MACE:
        case WeaponType.SPEAR:
          score += member.class.weaponsStats.twoHands * 0.5;
          break;
        case WeaponType.BOW:
          score += member.class.weaponsStats.bow * 0.5;
          break;
        case WeaponType.STAFF:
        case WeaponType.WAND:
          score += member.class.weaponsStats.enchantments * 0.5;
          break;
      }
    }

    return { member, score };
  });

  // Return the member with the highest score
  memberScores.sort((a, b) => b.score - a.score);
  return memberScores[0].member;
}

export function getAction(
  team: ITeam,
  lastTurn: ITurn | null,
  currentTurn: ITurn,
  gameState: IGame,
  dispatch: Dispatch
): IEvent | IEvent[] | null {
  // Check if the team is already involved in a blocking action
  if (isTeamInBlockingAction(team.id, currentTurn.events)) {
    return null;
  }
  const defaultEvent = {
    type: EventTypes.TRAVEL,
    teamId: team.id,
    description: `Team ${team.name} traveled to a new location.`,
    involvedParties: [team.id],
    involvedPersons: team.members.map(member => member.id),
    lootedWeapon: null,
  };
  if (lastTurn) {
    let tryMultiTeamEvent = Math.floor(Math.random() * 10);
    if (tryMultiTeamEvent < 2) {
      try {
        const [firstTeamEvent, secondTeamEvent, newRelationsMap] =
          createMultiTeamEvent(team, lastTurn, currentTurn, gameState);
        dispatch(updateRelationsMap(newRelationsMap));
        return [firstTeamEvent, secondTeamEvent];
      } catch (error) {
        console.log('error', error);
        return defaultEvent;
      }
    }
  }

  // Create actions object with chances
  const actions = EventPossibilities;

  // Calculate total chance
  const totalChance: number = Object.values(actions).reduce(
    (acc, { chance }) => acc + chance,
    0
  );

  // Generate random action based on chances
  let randomNum = Math.floor(Math.random() * totalChance);
  let selectedType = EventTypes.TRAVEL; // Default type
  let event: IEvent | null = null;
  let lootedWeapon = null;

  for (const [type, { chance }] of Object.entries(actions)) {
    if (randomNum < chance) {
      selectedType = type as EventTypes;

      // Generate event based on selected type
      switch (selectedType) {
        case EventTypes.ATTACK:
          {
            // Generic attack event (not against another team)
            event = {
              type: EventTypes.ATTACK,
              teamId: team.id,
              description: `Team ${team.name} attacked enemies!`,
              involvedParties: [team.id],
              involvedPersons: team.members.map(member => member.id),
              lootedWeapon: null,
            };
          }
          break;

        case EventTypes.LOOT:
          lootedWeapon = getRandomWeapon();
          const bestMemberForLoot = getBestMemberForWeapon(team, lootedWeapon);
          event = {
            type: EventTypes.LOOT,
            teamId: team.id,
            description: `Team ${team.name} found a ${lootedWeapon.rarity} ${lootedWeapon.type}: ${lootedWeapon.name}! ${bestMemberForLoot.name} takes it.`,
            involvedParties: [team.id],
            involvedPersons: team.members.map(member => member.id),
            lootedWeapon: lootedWeapon,
          };
          break;

        case EventTypes.KINGDOMDROP:
          lootedWeapon = getRandomWeapon(true); // Pass true for kingdom drops
          const bestMemberForKingdom = getBestMemberForWeapon(
            team,
            lootedWeapon
          );
          event = {
            type: EventTypes.KINGDOMDROP,
            teamId: team.id,
            description: `Team ${team.name} discovered a kingdom drop: a ${lootedWeapon.rarity} ${lootedWeapon.type}: ${lootedWeapon.name}! ${bestMemberForKingdom.name} takes it.`,
            involvedParties: [team.id],
            involvedPersons: team.members.map(member => member.id),
            lootedWeapon: lootedWeapon,
          };
          break;

        case EventTypes.TRAVEL:
          event = {
            type: EventTypes.TRAVEL,
            teamId: team.id,
            description: `Team ${team.name} traveled to a new location.`,
            involvedParties: [team.id],
            involvedPersons: team.members.map(member => member.id),
            lootedWeapon: null,
          };
          break;

        default:
          event = defaultEvent;
      }
      break;
    }
    randomNum -= chance;
  }

  // If no event was created, default to travel
  if (!event) {
    event = {
      teamId: team.id,
      type: EventTypes.TRAVEL,
      description: `Team ${team.name} traveled to a new location.`,
      involvedParties: [team.id],
      involvedPersons: team.members.map(member => member.id),
      lootedWeapon: null,
    };
  }

  return event;
}
