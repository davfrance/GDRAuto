import { IUser } from '../../Types/Game';
import { DEFAULT_AVATAR } from '../../Constants';
import WeaponCard from '../Weapons/WeaponCard';

interface UserCardProps {
  member: IUser;
}

const MemberCard = ({ member }: UserCardProps) => {
  return (
    <div className="p-3  rounded-md shadow-lg border  w-64 text-black">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={member.image || member.class?.iconImageUrl || DEFAULT_AVATAR}
          alt={member.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-bold text-sm text-black">{member.name}</h3>
          {member.gender && (
            <p className="text-xs text-gray-600">{member.gender}</p>
          )}
          {member.class && (
            <p className="text-xs font-medium text-black">
              {member.class.renderName}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 mt-2">
        <h4 className="font-semibold text-xs mb-1 text-black">Stats</h4>
        <div className="grid grid-cols-2 gap-1 text-xs text-black">
          <p>
            <span className="font-medium">HP:</span> {member.hp}
          </p>
          <p>
            <span className="font-medium">Mana:</span> {member.stats.mana}
          </p>
          <p>
            <span className="font-medium">Attack:</span> {member.stats.attack}
          </p>
          <p>
            <span className="font-medium">Magic:</span> {member.stats.magic}
          </p>
          <p>
            <span className="font-medium">Stamina:</span> {member.stats.stamina}
          </p>
          <p>
            <span className="font-medium">Hunger/Thirst:</span> {member.hunger}/
            {member.thirst}
          </p>
        </div>
      </div>

      {member.weapon && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <h4 className="font-semibold text-xs mb-1 text-black">Weapon</h4>
          <div className="flex items-center text-black">
            <WeaponCard weapon={member.weapon}></WeaponCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberCard;
