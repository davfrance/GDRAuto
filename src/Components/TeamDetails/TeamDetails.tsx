import { ITeam } from '../../Types/Game';
import Title from '../../Components/Titles/Title';
import SubTitle from '../../Components/Titles/SubTitle';
import { DEFAULT_AVATAR } from '../../Constants';
import { Button } from '@material-tailwind/react';

export interface ITeamDetails {
  team: ITeam | null;
  onClose: () => void;
}

function TeamDetails({ team, onClose }: ITeamDetails) {
  if (!team) return null;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <Title>{team.name}</Title>
        <Button
          {...({} as any)}
          placeholder=""
          variant="text"
          color="gray"
          onClick={onClose}
          className="text-gray-400 hover:text-myWhite p-1"
        >
          Close
        </Button>
      </div>
      <SubTitle>Team Members</SubTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.members.map(member => (
          <div
            key={member.id}
            className="p-4 rounded-md bg-gray-700 flex flex-col gap-3 shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  member.image ||
                  member.class?.iconImageUrl ||
                  DEFAULT_AVATAR
                }
                alt={member.name}
                className="w-16 h-16 rounded-full border border-gray-500"
              />
              <div>
                <h3 className="text-lg font-semibold text-myWhite">{member.name}</h3>
                <p className="text-gray-300 text-sm">{member.gender}</p>
                {member.class && (
                  <p className="text-sm text-gray-400">
                    Class: {member.class.renderName}
                  </p>
                )}
              </div>
            </div>

            {member.class && (
              <div className="mt-2 text-sm">
                <h4 className="font-semibold text-gray-200">Stats</h4>
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

            {member.weapon && Object.keys(member.weapon).length > 0 && (
              <div className="mt-2 text-sm">
                <h4 className="font-semibold text-gray-200">Weapon</h4>
                <p className="text-gray-300">{member.weapon.name}</p>
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
