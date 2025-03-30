interface RelationsTabProps {
  selectedTeamId: string | null;
  relations: Record<string, number>;
}

export default function RelationsTab({
  selectedTeamId,
  relations,
}: RelationsTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Team Relationships</h3>
      {Object.entries(relations)
        .filter(([key]) => {
          if (!selectedTeamId) return true;
          const [teamA, teamB] = key.split('_');
          return teamA === selectedTeamId || teamB === selectedTeamId;
        })
        .map(([relationKey, value]) => (
          <div key={relationKey} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">
                {relationKey.replace('_', ' → ')}
              </span>
              <span className="text-indigo-600">{value}%</span>
            </div>
          </div>
        ))}
    </div>
  );
}
