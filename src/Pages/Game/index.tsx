import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { ITurn } from '../../Types/Game';
import { getAction } from '../../Utils';
import { addTurn } from '../../Redux/Slices/Game';

function Game() {
  const [actualTurn, setActualTurn] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  const startGame = () => {
    setIsRunning(true);
  };

  const stopGame = () => {
    setIsRunning(false);
  };

  // Use effect to handle the game loop
  useEffect(() => {
    if (isRunning) {
      // Generate first turn immediately
      generateTurn();

      // Start game loop
      intervalRef.current = setInterval(() => {
        generateTurn();
      }, 3000); // 3 seconds per turn
    } else if (intervalRef.current) {
      // Clear interval when game is stopped
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Game</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={startGame}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          disabled={isRunning}
        >
          Start Game
        </button>
        <button
          onClick={stopGame}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
          disabled={!isRunning}
        >
          Stop Game
        </button>
      </div>

      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">
          Current Turn: {actualTurn}
        </h2>
        {gameState.history.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Last Turn Events:</h3>
            <ul className="space-y-2">
              {gameState.history[gameState.history.length - 1]?.events.map(
                (event, index) => (
                  <li key={index} className="border-b pb-2">
                    <p>
                      Team:{' '}
                      {gameState.teams.find(t => t.id === event.teamId)?.name}
                    </p>
                    <p>
                      Member:{' '}
                      {
                        gameState.teams
                          .flatMap(t => t.members)
                          .find(m => m.id === event.memberId)?.name
                      }
                    </p>
                    <p>Action: {event.description}</p>
                    <p>Type: {event.type}</p>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
