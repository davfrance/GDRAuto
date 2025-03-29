import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { EventTypes, ITurn, ITurnEvent } from '../../Types/Game';
import { getAction } from '../../Utils';
import { addTurn } from '../../Redux/Slices/Game';
import { IWeapon } from '../../Types/Weapons';
import { Tooltip } from '@material-tailwind/react';

function Game() {
  const [actualTurn, setActualTurn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const gameState = useSelector((state: RootState) => state.gameReducer);

  const generateTurn = () => {
    let lastTurn: ITurn | null = null;
    if (actualTurn > 0) {
      lastTurn = gameState.history[actualTurn - 1];
    }

    const newTurn: ITurn = {
      turnNumber: actualTurn + 1,
      events: [],
    };

    gameState.teams.forEach(team => {
      team.members.forEach(member => {
        const action = getAction(team, member, lastTurn);
        newTurn.events.push({
          teamId: team.id,
          memberId: member.id,
          action,
          timestamp: new Date().toISOString(),
          type: action.type,
          description: action.description,
          involvedParties: action.involvedParties,
          involvedPersons: action.involvedPersons,
        });
      });
    });

    // Dispatch action to update game state with new turn
    dispatch(addTurn(newTurn));
    setActualTurn(prev => prev + 1);
    return newTurn;
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
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-600';
      case 'Uncommon':
        return 'text-green-600';
      case 'Rare':
        return 'text-blue-600';
      case 'Epic':
        return 'text-purple-600';
      case 'Legendary':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };
  // Function to render weapon details for tooltip content
  const renderWeaponDetails = (weapon: IWeapon) => {
    return (
      <div className="p-2">
        <h4 className="font-semibold text-sm mb-1">{weapon.name}</h4>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <p>
            Type: <span className="font-medium">{weapon.type}</span>
          </p>
          <p>
            Rarity:{' '}
            <span className={`font-medium ${getRarityColor(weapon.rarity)}`}>
              {weapon.rarity}
            </span>
          </p>
          <p>
            Damage: <span className="font-medium">{weapon.damage}</span>
          </p>
          <p>
            Durability: <span className="font-medium">{weapon.durability}</span>
          </p>
        </div>
        {weapon.effects && weapon.effects.length > 0 && (
          <div className="mt-1">
            <p className="text-sm font-medium">Effects:</p>
            <ul className="list-disc list-inside text-sm">
              {weapon.effects.map((effect, i) => (
                <li key={i}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm italic mt-1">{weapon.description}</p>
      </div>
    );
  };

  // Function to render weapon name with appropriate color
  const renderWeaponName = (weapon: IWeapon) => {
    return (
      <Tooltip
        content={renderWeaponDetails(weapon)}
        placement="bottom"
        className="z-50"
      >
        <span
          className={`font-medium cursor-pointer ${getRarityColor(
            weapon.rarity
          )}`}
        >
          {weapon.name}
        </span>
      </Tooltip>
    );
  };

  // Function to get color class based on rarity

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Game</h1>

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

      <div className="border rounded-lg shadow-md p-6 bg-white">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Current Turn: {actualTurn}
        </h2>

        {gameState.history.length > 0 && (
          <div>
            <h3 className="text-xl font-medium mb-4">Turn Events:</h3>

            {Object.entries(
              groupEventsByTeam(
                gameState.history[gameState.history.length - 1]?.events || []
              )
            ).map(([teamId, events]) => {
              const team = gameState.teams.find(t => t.id === teamId);
              return (
                <div
                  key={teamId}
                  className="mb-6 border-l-4 border-indigo-500 pl-4 pb-2"
                >
                  <h4 className="text-lg font-semibold mb-2">{team?.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event, index) => {
                      const member = gameState.teams
                        .flatMap(t => t.members)
                        .find(m => m.id === event.memberId);

                      return (
                        <div
                          key={index}
                          className="border rounded-md p-3 bg-gray-50 shadow-sm"
                        >
                          <div className="flex items-center mb-2">
                            {member?.image && (
                              <img
                                src={member.image}
                                alt={member?.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            )}
                            <p className="font-medium">{member?.name}</p>
                          </div>
                          <p className="mb-1">
                            <span className="font-medium">Action:</span>{' '}
                            {event.description}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Type:</span>{' '}
                            {event.type}
                          </p>
                          {event.type === EventTypes.LOOT &&
                            event.action.lootedWeapon && (
                              <p className="mb-1">
                                <span className="font-medium">Found:</span>{' '}
                                {renderWeaponName(event.action.lootedWeapon)}
                              </p>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
