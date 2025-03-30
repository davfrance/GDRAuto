import { ITeam } from '../../Types/Game';

interface RelationsTabProps {
  selectedTeamPrime: number | null;
  relations: Record<number, number>;
  teams: ITeam[];
}

export default function RelationsTab({
  selectedTeamPrime,
  relations,
  teams,
}: RelationsTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Team Relationships</h3>
      {Object.keys(relations).map(key => {
        if (!selectedTeamPrime) return null;
        console.log(selectedTeamPrime);
        const remainder = Number.parseInt(key) % selectedTeamPrime;
        console.log(remainder);
        if (remainder === 0) return null;
        const otherTeam = teams.find(team => team.prime === remainder);
        if (!otherTeam) {
          return <></>;
        }
        return (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{otherTeam.name}</span>
              <span className="text-indigo-600">
                {relations[Number.parseInt(key)]}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
