import { ITeam } from '../../Types/Game';
import SubTitle from '../../Components/Titles/SubTitle';
import { DEFAULT_AVATAR } from '../../Constants';
import WeaponCard from '../Weapons/WeaponCard';

export interface ITeamDetails {
  team: ITeam | null;
  onClose: () => void;
}

function TeamDetails({ team, onClose }: ITeamDetails) {
  if (!team) return null;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <SubTitle>Team Members</SubTitle>
      <div className="flex flex-col gap-4">
        {team.members.map(member => (
          <div
            key={member.id}
            className="p-4 rounded-md bg-gray-700 flex gap-4 shadow"
          >
            <div className="flex gap-4 flex-col">
              <div className="flex items-center gap-4">
                <img
                  src={
                    member.image || member.class?.iconImageUrl || DEFAULT_AVATAR
                  }
                  alt={member.name}
                  className="w-16 h-16 rounded-full border border-gray-500"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{member.gender}</p>
                  {member.class && (
                    <p className="text-sm text-gray-400">
                      Class: {member.class.renderName}
                    </p>
                  )}
                </div>
                {member.weapon && Object.keys(member.weapon).length > 0 && (
                  <div className="mt-2 text-sm">
                    <h4 className="font-semibold text-gray-200 mb-1">Weapon</h4>
                    <WeaponCard weapon={member.weapon} />
                  </div>
                )}
              </div>
            </div>
            {member.class && (
              <div className="mt-2 text-sm">
                <h4 className="text-lg font-semibold text-white">Stats</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 text-gray-300">
                  <div>
                    <p>HP: {member.hp}</p>
                    <p>Mana: {member.stats.mana}</p>
                    <p>Attack: {member.stats.attack}</p>
                  </div>
                  <div>
                    <p>Magic: {member.stats.magic}</p>
                    <p>Stamina: {member.stats.stamina}</p>
                    <p>
                      Hunger/Thirst: {member.hunger}/{member.thirst}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {team.members.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          This team has no members yet. Add one using the sidebar!
        </p>
      )}
    </div>
  );
}

export default TeamDetails;
