import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { EventTypes, ITeam, ITurn, ITurnEvent } from '../../Types/Game';
import { getAction } from '../../Utils/gameUtils';
import { addTurn, saveTeam } from '../../Redux/Slices/Game';
import { useNavigate } from 'react-router-dom';
import MemberCard from '../../Components/UserCard/MemberCard';
import WeaponCard from '../../Components/Weapons/WeaponCard';
import RelationsTab from '../../Components/GamePageTabs/RelationsTab';
import _ from 'lodash';

function Game() {
  const [actualTurn, setActualTurn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeamPrime, setSelectedTeamPrime] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gameState = useSelector((state: RootState) => state.gameReducer);
  // Redirect to NewGame page if there are no teams
  useEffect(() => {
    if (gameState.teams.length === 0) {
      navigate('/newGame');
    }
  }, [gameState.teams.length, navigate]);

  const generateTurn = () => {
    let lastTurn: ITurn | null = null;
    if (actualTurn > 0) {
      lastTurn = gameState.history[actualTurn - 1];
    }

    const currentTurn: ITurn = {
      turnNumber: actualTurn + 1,
      events: [],
    };
    const teamsNoPointer = [...gameState.teams];

    // Process each team to generate their actions
    teamsNoPointer.forEach((team, i) => {
      // Generate one action per team instead of per member
      // Pass the current turn events being generated to check for existing encounters
      const doesTeamHaveEvent = currentTurn.events.find(event => {
        return event.teamId === team.id;
      });
      if (doesTeamHaveEvent) return;
      const teamAction = getAction(
        team,
        lastTurn,
        currentTurn,
        gameState,
        dispatch,
        i
      );
      if (!teamAction) {
        return;
      }
      if (_.isArray(teamAction)) {
        teamAction.forEach(event => {
          team.members.forEach(member => {
            const turnEvent: ITurnEvent = {
              teamId: event.teamId,
              memberId: member.id,
              action: event,
              timestamp: new Date().toISOString(),
              type: event.type,
              description: event.description,
              involvedParties: event.involvedParties,
              involvedPersons: event.involvedPersons,
            };
            // Add the event to the new turn
            console.log('currentTurn before', currentTurn);
            currentTurn.events = currentTurn.events.filter(e => {
              return e.teamId !== event.teamId;
            });

            console.log('currentTurn after filter', currentTurn);
            currentTurn.events.push(turnEvent);

            console.log('currentTurn after push', currentTurn);
          });
        });
      } else {
        team.members.forEach(member => {
          // Determine if this member should get the weapon (if it's a loot action)
          const isBestMemberForWeapon =
            (teamAction.type === EventTypes.LOOT ||
              teamAction.type === EventTypes.KINGDOMDROP) &&
            teamAction.lootedWeapon &&
            teamAction.description.includes(member.name);

          if (isBestMemberForWeapon && teamAction.lootedWeapon) {
            dispatch(
              saveTeam({
                ...team,
                members: [
                  ...team.members.filter(m => m.id !== member.id),
                  { ...member, weapon: teamAction.lootedWeapon },
                ],
              })
            );
          }

          // Create the turn event
          const turnEvent: ITurnEvent = {
            teamId: team.id,
            memberId: member.id,
            action: teamAction,
            timestamp: new Date().toISOString(),
            type: teamAction.type,
            description: teamAction.description,
            involvedParties: teamAction.involvedParties,
            involvedPersons: teamAction.involvedPersons,
          };

          // Add the event to the new turn
          currentTurn.events.push(turnEvent);
        });
      }
    });

    // Dispatch action to update game state with new turn
    dispatch(addTurn(currentTurn));
    setActualTurn(prev => prev + 1);
    return currentTurn;
  };

  const nextTurn = () => {
    setIsLoading(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      generateTurn();
      setIsLoading(false);
    }, 500);
  };
  // Helper function to group events by team
  const groupEventsByTeam = (events: ITurnEvent[]) => {
    const grouped: Record<string, ITurnEvent[]> = {};

    events.forEach(event => {
      if (!grouped[event.teamId]) {
        grouped[event.teamId] = [];
      }
      grouped[event.teamId].push(event);
    });

    return grouped;
  };

  // Helper function to get unique team actions
  // Since all members of a team now have the same action, we only need to display it once
  const getUniqueTeamAction = (events: ITurnEvent[]) => {
    if (events.length === 0) return null;
    return events[0]; // All team members have the same action, so we can just take the first one
  };

  // Helper function to find which team member gets a looted weapon
  const getMemberWithLootedWeapon = (events: ITurnEvent[], team: ITeam) => {
    if (events.length === 0 || !team) return null;

    // For loot events, find the member mentioned in the description
    if (
      events[0].type === EventTypes.LOOT ||
      events[0].type === EventTypes.KINGDOMDROP
    ) {
      // First check if there's a looted weapon
      if (!events[0].action.lootedWeapon) return null;

      // Find which team member is mentioned in the description
      for (const member of team.members) {
        if (events[0].description.includes(member.name)) {
          return events.find(event => event.memberId === member.id);
        }
      }
    }

    return null;
  };

  // Function to get color class based on rarity

  return (
    <div
      className="p-4 w-full mx-auto"
      onClick={() => setSelectedTeamPrime(null)}
      aria-hidden="true"
    >
      <div className="flex justify-center mb-6">
        <button
          onClick={nextTurn}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 text-lg font-medium"
          disabled={isLoading}
        >
          {isLoading
            ? 'Generating...'
            : actualTurn === 0
            ? 'Start Game'
            : 'Next Turn'}
        </button>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="border rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-2xl font-semibold">
              Current Turn: {actualTurn}
            </h2>
          </div>

          {gameState.history.length > 0 && (
            <div className="flex flex-row justify-between items-center w-full">
              <div>
                <h3 className="text-xl font-medium mb-4">Turn Events:</h3>
                {Object.entries(
                  groupEventsByTeam(
                    gameState.history[gameState.history.length - 1]?.events ||
                      []
                  )
                )
                  .sort(([teamIdA], [teamIdB]) => {
                    // Sort by team ID to ensure consistent ordering
                    return teamIdA.localeCompare(teamIdB);
                  })
                  .map(([teamId, events]) => {
                    const team = gameState.teams.find(
                      t => t.id === teamId
                    ) as ITeam;
                    const teamAction = getUniqueTeamAction(events);
                    const memberWithLoot = getMemberWithLootedWeapon(
                      events,
                      team
                    );
                    if (!teamAction) return null;

                    // Only show interactions when a second team is involved or for special events like loot
                    const shouldShowEvent =
                      teamAction.involvedParties?.length > 0 ||
                      teamAction.type === EventTypes.LOOT ||
                      teamAction.type === EventTypes.KINGDOMDROP;

                    if (!shouldShowEvent) return null;

                    return (
                      <div
                        key={teamId}
                        className="mb-6 border-l-4 border-indigo-500 pl-4 pb-2"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTeamPrime(team.prime);
                        }}
                        aria-hidden="true"
                      >
                        <div className="border rounded-md p-4 bg-gray-50 shadow-sm flex">
                          <div className="flex-grow">
                            <p className="mb-2 text-lg">
                              {teamAction.description}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                              {teamAction.type}
                            </p>

                            {/* Display involved teams with more prominence */}
                            {teamAction.involvedParties &&
                              teamAction.involvedParties.length > 0 &&
                              // First check if there are any teams to display after filtering
                              teamAction.involvedParties
                                .filter(partyId => partyId !== teamId)
                                .some(partyId =>
                                  gameState.teams.some(t => t.id === partyId)
                                ) && (
                                <div className="mb-3 p-2 bg-indigo-50 rounded border border-indigo-200">
                                  <p className="font-medium text-indigo-700">
                                    Interacting with:{' '}
                                    <span className="font-bold">
                                      {teamAction.involvedParties
                                        .map(partyId => {
                                          // Only show other teams, not the current team
                                          if (partyId === teamId) return null;
                                          const involvedTeam =
                                            gameState.teams.find(
                                              t => t.id === partyId
                                            );
                                          return involvedTeam
                                            ? involvedTeam.name
                                            : '';
                                        })
                                        .filter(Boolean)
                                        .join(', ')}
                                    </span>
                                  </p>
                                </div>
                              )}

                            {/* Display looted weapon if applicable */}
                            {(teamAction.type === EventTypes.LOOT ||
                              teamAction.type === EventTypes.KINGDOMDROP) &&
                              teamAction.action.lootedWeapon && (
                                <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
                                  <p className="font-medium mb-2">
                                    Loot Found:
                                  </p>
                                  <div className="flex items-center">
                                    <WeaponCard
                                      weapon={teamAction.action.lootedWeapon}
                                    ></WeaponCard>
                                  </div>

                                  {/* Show which team member gets the weapon */}
                                  {memberWithLoot && (
                                    <div className="mt-2 flex items-center">
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Assigned to:
                                        </span>{' '}
                                        {
                                          team?.members.find(
                                            m =>
                                              m.id === memberWithLoot.memberId
                                          )?.name
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>

                          {/* Team members section on the right side */}
                          <div className="ml-4 border-l pl-4 flex flex-col justify-center min-w-[180px]">
                            <h4 className="text-xs font-semibold mb-2 text-gray-700">
                              Team Members:
                            </h4>
                            <div className="flex flex-col gap-2">
                              {team?.members.map(member => {
                                return (
                                  <MemberCard
                                    member={member}
                                    key={member.id}
                                  ></MemberCard>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Only display team members for loot events to show who received the item */}
                        {(teamAction.type === EventTypes.LOOT ||
                          teamAction.type === EventTypes.KINGDOMDROP) &&
                          teamAction.action.lootedWeapon &&
                          memberWithLoot && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">
                                Received by:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {team?.members
                                  .filter(
                                    member =>
                                      member.id === memberWithLoot.memberId
                                  )
                                  .map(member => (
                                    <MemberCard
                                      member={member}
                                      key={member.id}
                                    ></MemberCard>
                                  ))}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
              </div>
              {selectedTeamPrime ? (
                <div className="w-1/3 pl-6 border-l">
                  <RelationsTab
                    selectedTeamPrime={selectedTeamPrime}
                    relations={gameState.relations}
                    teams={gameState.teams}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
