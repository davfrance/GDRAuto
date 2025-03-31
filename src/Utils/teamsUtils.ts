import { IGame, ITeam } from '../Types/Game';

export function getTeamFromId(
  teamId: string,
  gameState: IGame
): ITeam | undefined {
  const team = gameState.teams.find(team => {
    return team.id === teamId;
  });
  return team;
}
