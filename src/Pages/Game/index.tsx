import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import {
  EventTypes,
  ITeam,
  ITurn,
  ITurnEvent,
  IUser,
} from '../../Types/Game';
import { GameState } from '../../Redux/Slices/Game';
import { getAction } from '../../Utils/gameUtils';
import { addTurn, saveTeam } from '../../Redux/Slices/Game';
import { useNavigate } from 'react-router-dom';
import WeaponCard from '../../Components/Weapons/WeaponCard';
import RelationsTab from '../../Components/GamePageTabs/RelationsTab';
import FightScene from '../../Components/Fight/FightScene';
import TeamDetails from '../../Components/TeamDetails/TeamDetails';
import InfoModal from '../../Components/Modals/InfoModal';
import _ from 'lodash';
import { renderSegmentedDescription } from '../../Utils/renderingUtils.tsx';

function Game() {
  const [actualTurn, setActualTurn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [teamToShowDetails, setTeamToShowDetails] = useState<ITeam | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gameState = useSelector((state: RootState) => state.game as GameState);
  const fightIsActive = useSelector((state: RootState) => state.fight.isActive);

  const allTeamsForDisplay = [...gameState.teams, ...gameState.defeatedTeams];

  useEffect(() => {
    if (
      !fightIsActive &&
      gameState.teams.length === 0 &&
      gameState.defeatedTeams.length === 0 &&
      actualTurn === 0
    ) {
      navigate('/newGame');
    }
  }, [
    gameState.teams.length,
    gameState.defeatedTeams.length,
    navigate,
    fightIsActive,
    actualTurn,
  ]);

  const generateTurn = () => {
    if (fightIsActive) {
      console.log('Cannot generate turn while fight is active.');
      return;
    }
    let lastTurn: ITurn | null = null;
    if (actualTurn > 0) {
      lastTurn = gameState.history[actualTurn - 1];
    }

    const currentTurn: ITurn = {
      turnNumber: actualTurn + 1,
      events: [],
    };
    const activeTeamsForProcessing = _.cloneDeep(gameState.teams);

    activeTeamsForProcessing.forEach(team => {
      const doesTeamHaveEvent = currentTurn.events.find(event => {
        return event.involvedParties.includes(team.id);
      });
      if (doesTeamHaveEvent) return;
      const teamAction = getAction(
        team,
        lastTurn,
        currentTurn,
        gameState,
        dispatch
      );
      if (!teamAction) {
        return;
      }
      if (Array.isArray(teamAction)) {
        teamAction.forEach(event => {
          const isAlreadyAdded = currentTurn.events.some(
            e =>
              _.isEqual(e.description, event.description) &&
              _.isEqual(e.involvedParties.sort(), event.involvedParties.sort())
          );
          if (!isAlreadyAdded) {
            const turnEvent: ITurnEvent = {
              teamId: event.teamId,
              memberId: team.members[0].id,
              action: event,
              timestamp: new Date().toISOString(),
              type: event.type,
              description: event.description,
              involvedParties: event.involvedParties,
              involvedPersons: event.involvedPersons,
            };
            currentTurn.events.push(turnEvent);
          }
        });
      } else {
        const turnEvent: ITurnEvent = {
          teamId: team.id,
          memberId: team.members[0].id,
          action: teamAction,
          timestamp: new Date().toISOString(),
          type: teamAction.type,
          description: teamAction.description,
          involvedParties: teamAction.involvedParties,
          involvedPersons: teamAction.involvedPersons,
        };
        currentTurn.events.push(turnEvent);

        const isLootEvent =
          teamAction.type === EventTypes.LOOT ||
          teamAction.type === EventTypes.KINGDOMDROP;
        const currentTeamState = gameState.teams.find(t => t.id === team.id);
        if (isLootEvent && teamAction.lootedWeapon && currentTeamState) {
          const lootReceiverSegment = teamAction.description.find(seg => seg.type === 'user');
          let bestMember = null;
          if (lootReceiverSegment?.id) {
            bestMember = currentTeamState.members.find(m => m.id === lootReceiverSegment.id);
          }
          if (!bestMember && lootReceiverSegment) {
             bestMember = currentTeamState.members.find(m => m.name === lootReceiverSegment.value);
          }

          if (bestMember) {
            const updatedMembers: IUser[] = currentTeamState.members.map(m =>
              m.id === bestMember.id
                ? { ...m, weapon: teamAction.lootedWeapon || undefined }
                : m
            );
            dispatch(
              saveTeam({
                ...currentTeamState,
                members: updatedMembers,
              })
            );
          }
        }
      }
    });
    dispatch(addTurn(currentTurn));
    setActualTurn(prev => prev + 1);
    return currentTurn;
  };

  const nextTurn = () => {
    if (fightIsActive) {
      alert('Cannot advance turn during a fight!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      generateTurn();
      setIsLoading(false);
    }, 500);
  };

  const getMemberWithLootedWeapon = (
    event: ITurnEvent,
    team: ITeam | undefined
  ) => {
    if (!team || !event.action?.lootedWeapon) return null;
    if (
      event.type === EventTypes.LOOT ||
      event.type === EventTypes.KINGDOMDROP
    ) {
      // Attempt to find the member explicitly mentioned as the loot receiver
      const lootReceiverSegment = event.description.find(seg => seg.type === 'user');
      if (lootReceiverSegment?.id) {
        const receiver = team.members.find(m => m.id === lootReceiverSegment.id);
        if (receiver) return receiver;
      }

      // Fallback: If not found via specific segment ID, check involvedPersons (though less reliable now)
      const lootReceiverIdFromInvolved = event.involvedPersons.find(pId =>
        team.members.some(m => m.id === pId)
      );
      if (lootReceiverIdFromInvolved) {
        return team.members.find(m => m.id === lootReceiverIdFromInvolved);
      }

      // Final Fallback (less ideal): Find member whose name appears in any 'user' segment value
      // This is kept just in case the ID wasn't set correctly during event generation
      return team.members.find(member =>
        event.description.some(segment => segment.type === 'user' && segment.value === member.name)
      );
    }
    return null;
  };

  const lastTurnEvents =
    gameState.history.length > 0
      ? gameState.history[gameState.history.length - 1].events
      : [];

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleOpenDetailsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailsModalOpen(true);
  };

  const handleTeamSelect = (team: ITeam) => {
    if (teamToShowDetails?.id === team.id) {
      setTeamToShowDetails(null);
      setIsDetailsModalOpen(false);
    } else {
      setTeamToShowDetails(team);
      setIsDetailsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 bg-gray-900 text-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-myWhite">
          Game Runner
        </h1>
        <button
          onClick={nextTurn}
          disabled={isLoading || fightIsActive || gameState.teams.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-myWhite font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          {isLoading ? 'Processing...' : `Turn: ${actualTurn} (Next)`}
        </button>
      </div>

      <FightScene />

      {!fightIsActive && (
        <div className="flex-grow flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4 flex flex-col gap-4">
            <div className="bg-gray-800 p-3 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-center border-b border-gray-700 pb-1 text-gray-200">
                Teams
              </h3>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {allTeamsForDisplay.map(team => {
                  const isDefeated = gameState.defeatedTeams.some(
                    defeatedTeam => defeatedTeam.id === team.id
                  );
                  const isSelected = teamToShowDetails?.id === team.id;
                  return (
                    <div
                      key={team.id}
                      onClick={() => handleTeamSelect(team)}
                      className={`p-3 rounded-md transition-colors cursor-pointer flex justify-between items-center ${
                        isDefeated
                          ? 'bg-red-900/50 border border-red-700 opacity-60 hover:opacity-80'
                          : isSelected
                            ? 'bg-blue-900 border border-blue-500'
                            : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <span className={`font-semibold truncate ${isDefeated ? 'text-red-300 line-through' : 'text-white'}`}>
                        {team.name}
                      </span>
                      {isSelected && !isDefeated && (
                        <button
                          onClick={handleOpenDetailsModal}
                          className="text-xs text-gray-200 hover:text-blue-900 ml-2 px-2 py-0.5 rounded bg-transparent hover:bg-gray-200 transition-colors flex-shrink-0 font-bold"
                          title="View Details"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  );
                })}
                {allTeamsForDisplay.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No teams available.</p>
                )}
              </div>
            </div>

            {teamToShowDetails && (
              <div className="bg-gray-800 p-3 rounded-lg shadow">
                <RelationsTab
                  selectedTeamPrime={teamToShowDetails.prime}
                  relations={gameState.relations || {}}
                  teams={allTeamsForDisplay}
                />
              </div>
            )}
          </div>

          <div className="w-full md:w-3/4 bg-gray-800 p-4 rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-semibold mb-3 text-gray-200 border-b border-gray-700 pb-2">
              Event Log (Turn {actualTurn})
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
              {lastTurnEvents.length > 0 ? (
                lastTurnEvents.map((event, index) => {
                  const primaryTeam = allTeamsForDisplay.find(t => t.id === event.teamId);
                  const memberWithWeapon = getMemberWithLootedWeapon(event, primaryTeam);
                  const bgColor = event.type === EventTypes.ATTACK ? 'bg-red-800/30' : 'bg-gray-700/50';

                  return (
                    <div key={index} className={`p-3 rounded-md ${bgColor}`}>
                      <p className="text-sm text-gray-300">
                        <span className={`font-semibold ${primaryTeam ? 'text-white' : 'text-gray-400'}`}>
                          {primaryTeam ? primaryTeam.name : 'Unknown Team'}
                        </span>:{' '}
                        {renderSegmentedDescription(event.description, allTeamsForDisplay)}
                      </p>
                      {memberWithWeapon && event.action?.lootedWeapon && (
                        <div className="mt-2 pl-4 border-l-2 border-blue-500">
                          <WeaponCard weapon={event.action.lootedWeapon} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-6">
                  {actualTurn === 0 ? 'Click Next Turn to begin.' : 'No significant events this turn.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <InfoModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        title={teamToShowDetails ? `${teamToShowDetails.name} - Details` : 'Team Details'}
      >
        {teamToShowDetails && (
          <TeamDetails
            team={teamToShowDetails}
            onClose={handleCloseDetailsModal}
          />
        )}
      </InfoModal>
    </div>
  );
}

export default Game;