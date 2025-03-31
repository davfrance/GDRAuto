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
  const getRelationColor = (value: number) => {
    if (value < 33) return 'text-red-600';
    if (value < 66) return 'text-yellow-600';
    return 'text-green-600';
  };
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Team Relationships</h3>
      {Object.keys(relations).map(key => {
        if (!selectedTeamPrime) return null;
        console.log(selectedTeamPrime);
        const remainder = Number.parseInt(key) % selectedTeamPrime;
        console.log('remainder', remainder);
        if (remainder !== 0) return null;

        const otherTeam = teams.find(
          team => team.prime === Number.parseInt(key) / selectedTeamPrime
        );
        console.log('otherTeam', otherTeam);
        if (!otherTeam) {
          return <></>;
        }
        return (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{otherTeam.name}</span>
              <span
                className={getRelationColor(relations[Number.parseInt(key)])}
              >
                {relations[Number.parseInt(key)]}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
