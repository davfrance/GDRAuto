import {
  DEFAULT_HP,
  PARTIES_NAMES,
  PRIME_NUMBERS,
  USERS_NAMES,
} from '../Constants';
import { IClass, IClasses, classes } from '../Constants/classes';
import {
  EventPossibilities,
  EventTypes,
  IEvent,
  IEventsActions,
  IGame,
  IRelation,
  IStats,
  ITeam,
  ITurn,
  ITurnEvent,
  IUser,
} from '../Types/Game';

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
export function generateRelationsMap(): IRelation {
  const relations: IRelation = {};
  PRIME_NUMBERS.forEach(primeNumber => {
    PRIME_NUMBERS.forEach(secondPrimeNumber => {
      if (primeNumber != secondPrimeNumber)
        relations[primeNumber * secondPrimeNumber] = 50;
    });
  });
  return relations;
}
export function getUserPrimeNumber(teams: ITeam[]): number {
  const num = teams.reduce((totPlayer, team) => {
    return totPlayer + team.members.length;
  }, 0);
  return PRIME_NUMBERS[num];
}
function generateRandomUser(alreadyUsedNames: string[], teams: ITeam[]): IUser {
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
    prime: NaN,
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
  user.prime = getUserPrimeNumber(teams);
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
    const firstMember = generateRandomUser(usedNames, [
      ...(gameState?.teams ?? []),
      ...newTeams,
    ]);
    usedNames.push(firstMember.name);
    const secondMember = generateRandomUser(usedNames, [
      ...(gameState?.teams ?? []),
      ...newTeams,
    ]);
    teamMembers.push(firstMember, secondMember);
    let teamName = '';
    while (teamName === '') {
      const randNumForName = Math.floor(Math.random() * PARTIES_NAMES.length);
      console.log('alreadyUsedTeamNames', alreadyUsedTeamNames);
      console.log('name', PARTIES_NAMES[randNumForName], randNumForName);
      if (!alreadyUsedTeamNames.includes(PARTIES_NAMES[randNumForName])) {
        teamName = PARTIES_NAMES[randNumForName];
      }
    }
    alreadyUsedTeamNames.push(teamName);
    const newTeam: ITeam = {
      id: uuidv4(),
      members: [firstMember, secondMember],
      name: teamName,
    };
    newTeams.push(newTeam);
  }
  return newTeams;
}

export function getAction(
  team: ITeam,
  user: IUser,
  lastTurn: ITurn | null
): ITurnEvent {
  const allowedActions = [
    EventTypes.ENCOUNTER,
    EventTypes.KINGDOMDROP,
    EventTypes.LOOT,
    EventTypes.TRAVEL,
  ];

  // If there was a previous turn, allow more action types
  if (lastTurn) {
    allowedActions.push(
      EventTypes.ATTACK,
      EventTypes.RELATION_NEGATIVE,
      EventTypes.RELATION_POSITIVE
    );
  }

  // Create actions object with chances
  const actions: IEventsActions = {
    [EventTypes.ATTACK]: { chance: 0, action: {} },
    [EventTypes.LOOT]: { chance: 0, action: {} },
    [EventTypes.KINGDOMDROP]: { chance: 0, action: {} },
    [EventTypes.TRAVEL]: { chance: 0, action: {} },
    [EventTypes.ENCOUNTER]: { chance: 0, action: {} },
    [EventTypes.RELATION_POSITIVE]: { chance: 0, action: {} },
    [EventTypes.RELATION_NEGATIVE]: { chance: 0, action: {} },
  };

  // Set chances for allowed actions
  allowedActions.forEach(action => {
    actions[action] = EventPossibilities[action];
  });

  // Calculate total chance
  const totalChance: number = Object.values(actions).reduce(
    (acc, { chance }) => acc + chance,
    0
  );

  // Generate random action based on chances
  let randomNum = Math.floor(Math.random() * totalChance);
  let selectedType = EventTypes.TRAVEL; // Default type
  let description = `${user.name} traveled to a new location.`; // Default description

  for (const [type, { chance }] of Object.entries(actions)) {
    if (randomNum < chance) {
      selectedType = type as EventTypes;

      // Generate description based on event type
      switch (selectedType) {
        case EventTypes.ATTACK:
          description = `${user.name} attacked an enemy!`;
          break;
        case EventTypes.LOOT:
          description = `${user.name} found some valuable items!`;
          break;
        case EventTypes.KINGDOMDROP:
          description = `${user.name} discovered a kingdom drop!`;
          break;
        case EventTypes.TRAVEL:
          description = `${user.name} traveled to a new location.`;
          break;
        case EventTypes.ENCOUNTER:
          description = `${user.name} encountered something interesting!`;
          break;
        case EventTypes.RELATION_POSITIVE:
          description = `${user.name} improved relations with another party.`;
          break;
        case EventTypes.RELATION_NEGATIVE:
          description = `${user.name} worsened relations with another party.`;
          break;
        default:
          description = `${user.name} performed an unknown action.`;
      }
      break;
    }
    randomNum -= chance;
  }

  // Create the event object
  const event: IEvent = {
    type: selectedType,
    description,
    involvedParties: [team.id],
    involvedPersons: [user.id],
  };

  // Return the complete ITurnEvent
  return {
    teamId: team.id,
    memberId: user.id,
    action: event,
    timestamp: new Date().toISOString(),
    type: event.type,
    description: event.description,
    involvedParties: event.involvedParties,
    involvedPersons: event.involvedPersons,
  };
}
