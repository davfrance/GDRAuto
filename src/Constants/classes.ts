import { IStats } from '../Types/Game';

export interface IClassStats extends IStats {
  hp: number;
  mana: number;
}

export interface IWeapon {
  oneHand: number;
  twoHands: number;
  bow: number;
  enchantments:number
}

export interface IClass {
  stats: IClassStats;
  weapons: IWeapon;
  passiveSkill: string;
  renderName: string;
  imageUrl: string;
  iconImageUrl: string;
}

export interface IClasses {
  paladin: IClass;
  bandit: IClass;
  witch: IClass;
  highElf: IClass;
  darkElf: IClass;
  mountainDwarf: IClass;
  hillDwarf: IClass;
}

export const classes: IClasses = {
  paladin: {
    imageUrl: 'assets/paladin.jpg',
    iconImageUrl: 'assets/paladinIcon.jpg',
    renderName: 'Paladin',
    stats: {
      hp: 4,
      mana: 0,
      attack: 1,
      magic: 1,
      stamina: 2,
    },
    weapons: {
      oneHand: 1,
      twoHands: 4,
      bow: 0,
      enchantments:3,
    },
    passiveSkill:
      "Radiel's Protection: the IClass is protected by their deity (cannot get sick and occasionally receives rewards). However, the passive skill can be lost when committing immoral acts (e.g. Cannibalism) —> transforms into a renegade of the gods, the player gains +2 in all stats but falls prey to a constant homicidal instinct, leading to madness as the game continues (if not killed within a certain number of turns, the player commits suicide)",
  },
  bandit: {
    renderName: 'Bandit',
    imageUrl: 'assets/bandit.jpg',
    iconImageUrl: 'assets/banditIcon.jpg',
    stats: {
      hp: 1,
      mana: 0,
      stamina: 4,
      attack: 2,
      magic: 1,
    },
    weapons: {
      oneHand: 4,
      twoHands: 0,
      bow: 4,
      enchantments:0
    },
    passiveSkill:
      'lone wolf: +1 to all stats when fighting alone, +3 in hp and +1 stamina when his teammate dies (to be reviewed). The bandit has a +35% chance to flee during battles. Debuff: Being an outcast of society, his kingdom does not contribute to his battle. -75% chance of receiving rewards.',
  },
  witch: {
    renderName: 'Witch',
    imageUrl: 'assets/witch.jpg',
    iconImageUrl: 'assets/witchIcon.jpg',
    stats: {
      attack: 0,
      hp: 0,
      mana: 4,
      stamina: 0,
      magic: 4,
    },
    weapons: {
      oneHand: 2,
      twoHands: 0,
      bow: 0,
      enchantments:6
    },
    passiveSkill:
      "Arzathel's Pact, corrupted by an ancient God, the witch possesses great magical abilities and uses an ancient and forbidden magic. New unique spells for the subclass: Embrace of Evil: a powerful magic capable of inflicting huge damage 7 damage, but with a backlash -3hp. Corruption of the void: the witch forces the opponent to hit himself, the damage depends on the opponent's stats, -3hp. The witch can use only one of the two spells per battle.",
  },
  highElf: {
    renderName: 'High Elf',
    imageUrl: 'assets/highElf.jpg',
    iconImageUrl: 'assets/highElfIcon.jpg',
    stats: {
      hp: 0,
      mana: 2,
      stamina: 5,
      attack: 0,
      magic: 1,
    },
    weapons: {
      oneHand: 2,
      twoHands: 0,
      bow: 5,
      enchantments:1
    },
    passiveSkill:
      'Forest Wanderer: High Elf is able to track other players in the maze, for example, cannot be hit from behind or by surprise. Accustomed to life in the forest, the High Elf has excellent survivability, reduced hunger and thirst, inability to go insane. Debuff: High Elf constantly needs to be in contact with nature, loses 1 stamina every 3 rounds.',
  },
  darkElf: {
    renderName: 'Dark Elf',
    imageUrl: 'assets/darkElf.jpg',
    iconImageUrl: 'assets/darkElfIcon.jpg',
    stats: {
      hp: 0,
      mana: 3,
      stamina: 0,
      attack: 2,
      magic: 3,
    },
    weapons: {
      oneHand: 3,
      twoHands: 0,
      bow: 2,
      enchantments:3
    },
    passiveSkill:
      'One who lies in the shadows: Dark elves are known for their powerful dark and blood magic. Transfusion: if a dark elf is injured, eating bodies will restore 25% of their total life, restore hunger, and have no penalty to water (cannibalism gives a debuff to normal water consumption). Unique Magic: Disciple of Hemos, make it impossible for the dark elf to die in battle for that 1 turn (remains at 1 hp) (usable once per game). Debuff: The esoteric practices of dark elves do not receive any support from the kingdoms, marked by the gods: dark elves are unable to use magic from other races/classes',
  },
  mountainDwarf: {
    renderName: 'Mountain Dwarf',
    imageUrl: 'assets/mountainDwarf.jpg',
    iconImageUrl: 'assets/mountainDwarfIcon.jpg',
    stats: {
      hp: 4,
      mana: 0,
      stamina: 3,
      attack: 1,
      magic: 0,
    },
    weapons: {
      oneHand: 4,
      twoHands: 4,
      bow: 0,
      enchantments:0
    },
    passiveSkill:
      "Strength in Unity: If Mountain Dwarf is in a party with another dwarf, he gains bonuses to stats: hp +2, stamina +1, two hands +1. --> Dwarven Engineering: -25% provision consumption, ability to perform unique interactions with the environment (e.g. creating complex traps), cannot die from traps (only injured). Runic Protection: -15% magical damage received only for the first 2 magical attacks (per game). Debuff: +25% magical damage taken, the dwarf's attacks are more powerful but consume a large amount of energy +2 generic damage can attack every other turn.",
  },
  hillDwarf: {
    renderName: 'Hill Dwarf',
    imageUrl: 'assets/hillsDwarf.jpg',
    iconImageUrl: 'assets/hillsDwarfIcon.jpg',
    stats: {
      hp: 2,
      mana: 0,
      stamina: 2,
      attack: 4,
      magic: 0,
    },
    weapons: {
      oneHand: 4,
      twoHands: 4,
      bow: 0,
      enchantments:0
    },
    passiveSkill:
      "Strength in Unity: If Hill Dwarf is in a party with another dwarf, he gains bonuses to stats: hp +2, stamina +1, magic +2. --> Wisdom of the ancient world: hill dwarves have passed down their knowledge of the world learned over the generations: Hill Dwarf knows secret passages in the maze, starts the adventure with a weapon of his choice. Ancestor's Protection: If he gets sick or injured, he has a 40% chance to heal naturally every turn. Debuff: Hill Dwarf is marked with the weight of knowledge, his mental hp deteriorates continuously every turn. If sanity exceeds a certain threshold, Hill Dwarf increases ration consumption.",
  },
};
