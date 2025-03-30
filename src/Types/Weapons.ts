export enum WeaponRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
}

export enum WeaponType {
  SWORD = 'Sword',
  AXE = 'Axe',
  BOW = 'Bow',
  STAFF = 'Staff',
  DAGGER = 'Dagger',
  MACE = 'Mace',
  WAND = 'Wand',
  SPEAR = 'Spear',
}

export interface IWeapon {
  id: string;
  name: string;
  type: WeaponType;
  rarity: WeaponRarity;
  damage: number;
  durability: number;
  effects?: string[];
  description: string;
  imageUrl?: string;
}
