import { IWeapon, WeaponRarity, WeaponType } from '../Types/Weapons';
import { uuidv4 } from '../Utils';

// Sample weapons data - this is a basic layout that can be expanded later
export const WEAPONS: IWeapon[] = [
  {
    id: uuidv4(),
    name: 'Iron Sword',
    type: WeaponType.SWORD,
    rarity: WeaponRarity.COMMON,
    damage: 5,
    durability: 100,
    description: 'A basic iron sword, reliable but nothing special.',
  },
  {
    id: uuidv4(),
    name: "Hunter's Bow",
    type: WeaponType.BOW,
    rarity: WeaponRarity.COMMON,
    damage: 4,
    durability: 80,
    description: 'A simple wooden bow used for hunting.',
  },
  {
    id: uuidv4(),
    name: 'Apprentice Staff',
    type: WeaponType.STAFF,
    rarity: WeaponRarity.COMMON,
    damage: 3,
    durability: 90,
    effects: ['Increases magic by 1'],
    description: 'A wooden staff given to apprentice mages.',
  },
  {
    id: uuidv4(),
    name: 'Steel Dagger',
    type: WeaponType.DAGGER,
    rarity: WeaponRarity.UNCOMMON,
    damage: 4,
    durability: 70,
    description: 'A sharp steel dagger, perfect for quick strikes.',
  },
  {
    id: uuidv4(),
    name: 'Enchanted Mace',
    type: WeaponType.MACE,
    rarity: WeaponRarity.RARE,
    damage: 8,
    durability: 120,
    effects: ['Stuns enemies on critical hits'],
    description: 'A mace with magical runes that occasionally stuns enemies.',
  },
  {
    id: uuidv4(),
    name: 'Dragonbone Spear',
    type: WeaponType.SPEAR,
    rarity: WeaponRarity.EPIC,
    damage: 12,
    durability: 150,
    effects: ['Pierces armor', '+3 attack range'],
    description: 'A spear crafted from the bones of an ancient dragon.',
  },
  {
    id: uuidv4(),
    name: 'Wand of Arcane Might',
    type: WeaponType.WAND,
    rarity: WeaponRarity.LEGENDARY,
    damage: 15,
    durability: 200,
    effects: ['Increases magic by 5', 'Reduces spell cost by 20%'],
    description: 'A legendary wand that channels immense arcane power.',
  },
];

// Function to get a random weapon based on rarity chances
// When isKingdomDrop is true, only rare or higher weapons will be returned
export function getRandomWeapon(isKingdomDrop = false): IWeapon {
  // Define rarity chances (percentages)
  const rarityChances = isKingdomDrop
    ? {
        // Kingdom drops only give rare or higher weapons
        [WeaponRarity.RARE]: 70,
        [WeaponRarity.EPIC]: 25,
        [WeaponRarity.LEGENDARY]: 5,
      }
    : {
        // Normal loot distribution
        [WeaponRarity.COMMON]: 50,
        [WeaponRarity.UNCOMMON]: 30,
        [WeaponRarity.RARE]: 15,
        [WeaponRarity.EPIC]: 4,
        [WeaponRarity.LEGENDARY]: 1,
      };

  // Calculate total chance
  const totalChance = Object.values(rarityChances).reduce(
    (sum, chance) => sum + chance,
    0
  );

  // Generate random number
  let random = Math.floor(Math.random() * totalChance);

  // Determine rarity based on random number
  let selectedRarity = WeaponRarity.COMMON;
  for (const [rarity, chance] of Object.entries(rarityChances)) {
    if (random < chance) {
      selectedRarity = rarity as WeaponRarity;
      break;
    }
    random -= chance;
  }

  // Filter weapons by selected rarity
  const weaponsOfRarity = WEAPONS.filter(
    weapon => weapon.rarity === selectedRarity
  );

  // If no weapons of that rarity, return a common weapon
  if (weaponsOfRarity.length === 0) {
    return WEAPONS[0];
  }

  // Return a random weapon of the selected rarity
  return weaponsOfRarity[Math.floor(Math.random() * weaponsOfRarity.length)];
}
