import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { ITurn } from '../../Types/Game';

function Game() {
  const [actualTurn, setActualTurn] = useState(0);

  const gameState = useSelector((state: RootState) => state.gameReducer);
  const generateTurn = () => {
    let lastTurn:ITurn | null = {} as ITurn;
    if (actualTurn > 0) {
      lastTurn = gameState.history[actualTurn - 1];
    }
    gameState.teams.forEach((team)=>{
      team.members.forEach((member)=>{
        getAction(team, member, lastTurn)
      })
    })
  };

  return <div>Game</div>;
}

export default Game;
