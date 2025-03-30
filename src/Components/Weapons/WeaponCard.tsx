import { Tooltip } from '@material-tailwind/react';
import { IWeapon } from '../../Types/Weapons';

interface WeaponCardProps {
  weapon: IWeapon;
}
const WeaponCard = ({ weapon }: WeaponCardProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-600';
      case 'Uncommon':
        return 'text-green-600';
      case 'Rare':
        return 'text-blue-600';
      case 'Epic':
        return 'text-purple-600';
      case 'Legendary':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };
  // Function to render weapon details for tooltip content
  const renderWeaponDetails = (weapon: IWeapon) => {
    return (
      <div className="p-2">
        <h4 className="font-semibold text-sm mb-1">{weapon.name}</h4>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <p>
            Type: <span className="font-medium">{weapon.type}</span>
          </p>
          <p>
            Rarity:{' '}
            <span className={`font-medium ${getRarityColor(weapon.rarity)}`}>
              {weapon.rarity}
            </span>
          </p>
          <p>
            Damage: <span className="font-medium">{weapon.damage}</span>
          </p>
          <p>
            Durability: <span className="font-medium">{weapon.durability}</span>
          </p>
        </div>
        {weapon.effects && weapon.effects.length > 0 && (
          <div className="mt-1">
            <p className="text-sm font-medium">Effects:</p>
            <ul className="list-disc list-inside text-sm">
              {weapon.effects.map((effect, i) => (
                <li key={i}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm italic mt-1">{weapon.description}</p>
      </div>
    );
  };

  return (
    <Tooltip
      content={renderWeaponDetails(weapon)}
      placement="bottom"
      className="z-50"
    >
      <span
        className={`font-medium cursor-pointer ${getRarityColor(
          weapon.rarity
        )}`}
      >
        {weapon.name}
      </span>
    </Tooltip>
  );
};
export default WeaponCard;
