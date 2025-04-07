import _ from 'lodash';
import {
  EventTypes,
  IEvent,
  IGame,
  IRelation,
  ITeam,
  ITurn,
  ITurnEvent,
  IUser,
  IDescriptionSegment,
} from '../Types/Game';
import { getTeamFromId } from './teamsUtils';

enum ChangeTypeEnum {
  Relative = 'relative',
  Absolute = 'absolute',
}
interface changeRelationValue {
  changeType: ChangeTypeEnum;
  value: number;
}
type multiTeamEventFunctionsReturn = [IEvent, IEvent, IRelation];

function findRelationsKey(firstTeam: ITeam, secondTeam: ITeam): number {
  const firstTeamPrime = firstTeam.prime;
  const secondTeamPrime = secondTeam.prime;
  return firstTeamPrime * secondTeamPrime;
}

function getUpdatedTeamRelations(
  firstTeam: ITeam,
  secondTeam: ITeam,
  relationsMap: IRelation,
  change: changeRelationValue
): IRelation {
  const relationKey = findRelationsKey(firstTeam, secondTeam);
  if (change.changeType == ChangeTypeEnum.Absolute) {
    relationsMap[relationKey] = change.value;
  } else {
    relationsMap[relationKey] = relationsMap[relationKey] + change.value;
  }
  return relationsMap;
}

/**
 * Creates an encounter event between two teams
 */
function createTeamEncounter(
  firstTeam: ITeam,
  secondTeam: ITeam
): [IEvent, IEvent] {
  // Changed description generation
  const descriptionFirstTeam: IDescriptionSegment[] = [
    { type: 'text', value: 'Encountered members of the ' },
    { type: 'team', value: secondTeam.name, id: secondTeam.id },
    { type: 'text', value: ' team.' },
  ];
  const descriptionSecondTeam: IDescriptionSegment[] = [
    { type: 'text', value: 'Encountered members of the ' },
    { type: 'team', value: firstTeam.name, id: firstTeam.id },
    { type: 'text', value: ' team.' },
  ];

  const eventFirstTeam: IEvent = {
    type: EventTypes.ENCOUNTER,
    teamId: firstTeam.id,
    description: descriptionFirstTeam, // Use segmented description
    involvedParties: [firstTeam.id, secondTeam.id],
    involvedPersons: [
      ...firstTeam.members.map(member => member.id),
      ...secondTeam.members.map(member => member.id),
    ],
    lootedWeapon: null,
  };
  const eventSecondTeam: IEvent = {
    type: EventTypes.ENCOUNTER,
    teamId: secondTeam.id,
    description: descriptionSecondTeam, // Use segmented description
    involvedParties: [secondTeam.id, firstTeam.id],
    involvedPersons: [
      ...secondTeam.members.map(member => member.id),
      ...firstTeam.members.map(member => member.id),
    ],
    lootedWeapon: null,
  };
  return [eventFirstTeam, eventSecondTeam];
}

/**
 * Creates a relation event (positive or negative) between two teams
 */
function createTeamRelationEvent(
  activeTeam: ITeam,
  otherTeam: ITeam,
  relationType: EventTypes.RELATION_POSITIVE | EventTypes.RELATION_NEGATIVE,
  relationsMap: IRelation
): multiTeamEventFunctionsReturn {
  // Changed descriptions generation
  const descriptionFirstTeam: IDescriptionSegment[] =
    relationType === EventTypes.RELATION_POSITIVE
      ? [
          { type: 'text', value: 'Relations improved with ' },
          { type: 'team', value: otherTeam.name, id: otherTeam.id },
          { type: 'text', value: '.' },
        ]
      : [
          { type: 'text', value: 'Relations worsened with ' },
          { type: 'team', value: otherTeam.name, id: otherTeam.id },
          { type: 'text', value: '.' },
        ];
  const descriptionSecondTeam: IDescriptionSegment[] =
    relationType === EventTypes.RELATION_POSITIVE
      ? [
          { type: 'text', value: 'Relations improved with ' },
          { type: 'team', value: activeTeam.name, id: activeTeam.id },
          { type: 'text', value: '.' },
        ]
      : [
          { type: 'text', value: 'Relations worsened with ' },
          { type: 'team', value: activeTeam.name, id: activeTeam.id },
          { type: 'text', value: '.' },
        ];

  // Create the relation event
  const eventFirstTeam: IEvent = {
    type: relationType,
    teamId: activeTeam.id,
    description: descriptionFirstTeam, // Use segmented description
    involvedParties: [activeTeam.id, otherTeam.id],
    involvedPersons: [
      ...activeTeam.members.map(member => member.id),
      ...otherTeam.members.map(member => member.id),
    ],
    lootedWeapon: null,
  };
  const eventSecondTeam: IEvent = {
    type: relationType,
    teamId: otherTeam.id,
    description: descriptionSecondTeam, // Use segmented description
    involvedParties: [activeTeam.id, otherTeam.id],
    involvedPersons: [
      ...otherTeam.members.map(member => member.id),
      ...activeTeam.members.map(member => member.id),
    ],
    lootedWeapon: null,
  };

  const value = relationType === EventTypes.RELATION_POSITIVE ? 10 : -10;
  const newRelationsMap = getUpdatedTeamRelations(
    activeTeam,
    otherTeam,
    relationsMap,
    {
      changeType: ChangeTypeEnum.Relative,
      value,
    }
  );

  return [eventFirstTeam, eventSecondTeam, newRelationsMap];
}

/**
 * Creates an attack event between two teams
 */
function createTeamAttackEvent(
  activeTeam: ITeam,
  otherTeam: ITeam,
  relationsMap: IRelation
): multiTeamEventFunctionsReturn {
  // Changed descriptions generation
  const descriptionFirstTeam: IDescriptionSegment[] = [
    { type: 'text', value: 'Attacked members of the ' },
    { type: 'team', value: otherTeam.name, id: otherTeam.id },
    { type: 'text', value: ' team!' },
  ];
  const descriptionSecondTeam: IDescriptionSegment[] = [
    { type: 'text', value: 'Attacked members of the ' },
    { type: 'team', value: activeTeam.name, id: activeTeam.id },
    { type: 'text', value: ' team!' },
  ];

  const eventFirstTeam: IEvent = {
    type: EventTypes.ATTACK,
    teamId: activeTeam.id,
    description: descriptionFirstTeam, // Use segmented description
    involvedParties: [activeTeam.id, otherTeam.id],
    involvedPersons: [
      ...activeTeam.members.map(member => member.id),
      ...otherTeam.members.map(member => member.id),
    ],
    lootedWeapon: null,
  };
  const eventSecondTeam: IEvent = {
    type: EventTypes.ATTACK,
    teamId: otherTeam.id,
    description: descriptionSecondTeam, // Use segmented description
    involvedParties: [otherTeam.id, activeTeam.id],
    involvedPersons: [
      ...otherTeam.members.map(member => member.id),
      ...activeTeam.members.map(member => member.id),
    ],
    lootedWeapon: null,
  };
  const newRelationsMap = getUpdatedTeamRelations(
    activeTeam,
    otherTeam,
    relationsMap,
    {
      changeType: ChangeTypeEnum.Absolute,
      value: 0,
    }
  );

  return [eventFirstTeam, eventSecondTeam, newRelationsMap];
}

/**
 * Checks if a team is already involved in a blocking action in the current turn events
 */
export function isTeamInBlockingAction(
  teamId: string,
  currentTurnEvents: ITurnEvent[]
): boolean {
  if (!currentTurnEvents || currentTurnEvents.length === 0) return false;

  // Check if the team is involved in any event as *any* party
  const teamInvolved = currentTurnEvents.some(event => 
      event.involvedParties.includes(teamId)
  );
  
  return teamInvolved;
}

/**
 * Determines if two teams can interact based on their encounter history
 */
function canTeamsInteract(
  team1Id: string,
  team2Id: string,
  lastTurn: ITurn | null
): boolean {
  if (!lastTurn) return false;

  // Check if team1 had an encounter with team2 in the previous turn
  const team1EncounteredTeam2 = lastTurn.events.some(
    event =>
      event.teamId === team1Id &&
      event.type === EventTypes.ENCOUNTER &&
      event.involvedParties.includes(team2Id)
  );

  // Check if team2 had an encounter with team1 in the previous turn
  const team2EncounteredTeam1 = lastTurn.events.some(
    event =>
      event.teamId === team2Id &&
      event.type === EventTypes.ENCOUNTER &&
      event.involvedParties.includes(team1Id)
  );

  // Teams can interact if they both encountered each other
  return team1EncounteredTeam2 && team2EncounteredTeam1;
}

/**
 * Finds a team that the active team can encounter in the current turn
 */
function findTeamToEncounter(
  activeTeam: ITeam,
  gameState: IGame,
  currentTurnEvents: ITurnEvent[],
  lastTurn: ITurn | null
): string | null {
  // Get all team IDs from the game state
  const allTeamIds = gameState.teams.map(team => team.id);
  // Find teams that haven't had actions yet (excluding the current team)
  const availableTeamIds = allTeamIds.filter(
    id => id !== activeTeam.id && !isTeamInBlockingAction(id, currentTurnEvents)
  );
  // Sort available team IDs alphabetically for consistent ordering
  availableTeamIds.sort((a, b) => a.localeCompare(b));
  if (availableTeamIds.length > 0) {
    // Randomly select one of the available teams
    console.log('availableTeamIds', availableTeamIds);
    const selectedIndex = Math.floor(Math.random() * availableTeamIds.length);
    console.log('availableTeamIds selectedIndex', selectedIndex);
    return availableTeamIds[selectedIndex];
  }

  return null;
}

/**
 * Finds a team that the active team previously encountered and can now interact with
 */
function findPreviouslyEncounteredTeam(
  activeTeam: ITeam,
  lastTurn: ITurn | null
): string | null {
  if (!lastTurn) return null;

  // Find if this team had an encounter in the previous turn
  const previousTeamEvent = lastTurn.events.find(
    event =>
      event.teamId === activeTeam.id && event.type === EventTypes.ENCOUNTER
  );

  // If team had an encounter, check if it involved another team
  if (previousTeamEvent && previousTeamEvent.involvedParties.length > 1) {
    // Find the other team involved (not the current team)
    const encounteredTeamId =
      previousTeamEvent.involvedParties.find(
        partyId => partyId !== activeTeam.id
      ) || null;

    // If there was an encounter with another team, check if it's valid for interaction
    if (encounteredTeamId) {
      // Check if the other team also had an encounter with this team
      const previousEncounteredTeamEvent = lastTurn.events.find(
        event =>
          event.teamId === encounteredTeamId &&
          event.type === EventTypes.ENCOUNTER &&
          event.involvedParties.includes(activeTeam.id)
      );

      // Only return the team ID if both teams had an encounter with each other
      if (previousEncounteredTeamEvent) {
        return encounteredTeamId;
      }
    }
  }

  return null;
}

function getTeamsRelation(
  firstTeam: ITeam,
  secondTeam: ITeam,
  relationsMap: IRelation
) {
  const relationKey = findRelationsKey(firstTeam, secondTeam);
  return relationsMap[relationKey];
}

export function createMultiTeamEvent(
  firstTeam: ITeam,
  lastTurn: ITurn | null,
  currentTurn: ITurn,
  gameStateRel: IGame
): multiTeamEventFunctionsReturn {
  const gameState = _.cloneDeep(gameStateRel);
  const secondTeamId = findPreviouslyEncounteredTeam(firstTeam, lastTurn);
  if (!secondTeamId) {
    const secondTeamId = findTeamToEncounter(
      firstTeam,
      gameState,
      currentTurn.events,
      lastTurn
    );
    console.log('secondTeamId fuera ', secondTeamId);
    if (!secondTeamId) {
      throw new Error('first error with teamid');
    }
    const secondTeam = getTeamFromId(secondTeamId, gameState);
    console.log('secondTeam', secondTeam);
    if (!secondTeam) {
      throw new Error('first error with team');
    }
    console.log('secondTeamId dentro ', secondTeamId);

    return [...createTeamEncounter(firstTeam, secondTeam), gameState.relations];
  }
  if (!secondTeamId) {
    throw new Error('second error with team id');
  }
  const secondTeam = getTeamFromId(secondTeamId, gameState);
  if (!canTeamsInteract(firstTeam.id, secondTeamId, lastTurn)) {
    throw new Error('teams cant interact');
  }
  if (!secondTeam) {
    throw new Error('second error with team');
  }
  const teamRelations = getTeamsRelation(
    firstTeam,
    secondTeam,
    gameState.relations
  );
  const randomNum = Math.floor(Math.random() * 100);
  if (randomNum < teamRelations) {
    const relationsEventDecider = Math.floor(Math.random() * 100);
    if (relationsEventDecider < teamRelations) {
      return createTeamRelationEvent(
        firstTeam,
        secondTeam,
        EventTypes.RELATION_POSITIVE,
        gameState.relations
      );
    }
    return createTeamRelationEvent(
      firstTeam,
      secondTeam,
      EventTypes.RELATION_NEGATIVE,
      gameState.relations
    );
  } else {
    return createTeamAttackEvent(firstTeam, secondTeam, gameState.relations);
  }

  throw new Error('Should have not reached here');
}
