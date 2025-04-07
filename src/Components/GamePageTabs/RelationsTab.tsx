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

  // Update relation colors for better contrast on dark background
  const getRelationColor = (value: number) => {
    if (value < 33) return 'text-red-400';     // Brighter red
    if (value < 66) return 'text-yellow-400';  // Brighter yellow
    return 'text-green-400';   // Brighter green
  };

  // Filter related teams first for cleaner rendering
  const relatedTeamsData = Object.keys(relations)
    .map(key => {
      if (!selectedTeamPrime || (Number.parseInt(key) % selectedTeamPrime) !== 0) {
        return null;
      }
      const otherTeamPrime = Number.parseInt(key) / selectedTeamPrime;
      const otherTeam = teams.find(team => team.prime === otherTeamPrime);
      if (!otherTeam) {
        return null;
      }
      return {
        key,
        otherTeam,
        relationValue: relations[Number.parseInt(key)],
      };
    })
    .filter(Boolean); // Remove null entries

  return (
    <div className="space-y-3"> {/* Reduced spacing slightly */}
      {/* Update header text color */}
      <h3 className="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">
        Relationships
      </h3>
      {relatedTeamsData.length > 0 ? (
        relatedTeamsData.map(data => {
            if (!data) return null; // Type guard
            const { key, otherTeam, relationValue } = data;
            return (
              // Update relation item background and text color
              <div key={key} className="bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">{otherTeam.name}</span>
                  <span className={`font-semibold ${getRelationColor(relationValue)}`}>
                    {relationValue}%
                  </span>
                </div>
              </div>
            );
        })
      ) : (
        // Add a message when no relations are displayed
        <p className="text-sm text-gray-500 text-center py-4">
          No relationship data available for the selected team.
        </p>
      )}
    </div>
  );
}
