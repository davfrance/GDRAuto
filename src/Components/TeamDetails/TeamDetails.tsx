import { Modal } from '@mui/material';
import { ITeam } from '../../Types/Game';
import Title from '../../Components/Titles/Title';
import SubTitle from '../../Components/Titles/SubTitle';
import { DEFAULT_AVATAR } from '../../Constants';

export interface ITeamDetails {
  team: ITeam | null;
  open: boolean;
  onClose: () => void;
}

function TeamDetails({ team, open, onClose }: ITeamDetails) {
  if (!team) return null;

  return (
    <Modal
      open={open}
      className=""
      onClose={onClose}
      //   onClose={(event, reason) => {
      //     if (reason === 'backdropClick') {
      //       onClose();
      //     }
      //   }}
    >
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-4 w-2/3 h-fit p-8 m-auto bg-myWhite rounded-lg overflow-y-auto max-h-[80vh]">
          <Title contrast>{team.name}</Title>
          <SubTitle>Team Members</SubTitle>
          <div className="grid grid-cols-2 gap-6">
            {team.members.map(member => (
              <div
                key={member.id}
                className="p-6 rounded-md bg-secondary flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      member.image ||
                      member.class?.iconImageUrl ||
                      DEFAULT_AVATAR
                    }
                    alt={member.name}
                    className="w-20 aspect-square rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p>{member.gender}</p>
                    {member.class && (
                      <p className="text-sm">
                        Class: {member.class.renderName}
                      </p>
                    )}
                  </div>
                </div>

                {member.class && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Stats</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2">
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
                  <div className="mt-4">
                    <h4 className="font-semibold">Weapon</h4>
                    <p>{member.weapon.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TeamDetails;
