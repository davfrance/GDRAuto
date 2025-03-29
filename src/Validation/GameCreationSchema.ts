import * as yup from 'yup';
import { IGame, IStats, ITeam, IUser } from '../Types/Game';

const statsSchema: yup.ObjectSchema<IStats> = yup.object({
  mana: yup.number().required(),
  attack: yup.number().required(),
  magic: yup.number().required(),
  stamina: yup.number().required(),
});
export const memberSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  gender: yup.string(),
  image: yup.string(),
  weapon: yup.object(),
  hunger: yup.number().required(),
  thirst: yup.number().required(),
  hp: yup.number().required(),
  class: yup.object().shape({
    stats: yup
      .object()
      .shape({
        hp: yup.number().required(),
        mana: yup.number().required(),
        attack: yup.number().required(),
        magic: yup.number().required(),
        stamina: yup.number().required(),
      })
    // weapons: yup
    //   .object()
    //   .shape({
    //     oneHand: yup.number().required(),
    //     twoHands: yup.number().required(),
    //     bow: yup.number().required(),
    //     enchantments: yup.number().required(),
    //   })
    //   .required(),
    // passiveSkill: yup.string().required(),
    // renderName: yup.string().required(),
    // imageUrl: yup.string().required(),
    // iconImageUrl: yup.string().required(),
  }),
  stats: statsSchema.required(),
  prime: yup.number().required(),
});

const teamSchema: yup.ObjectSchema<ITeam> = yup.object({
  id: yup.string().required(),
  members: yup.array().of(memberSchema).min(2).required(),
  name: yup.string().required(),
});

export const gameCreationSchema: yup.ObjectSchema<IGame> = yup.object({
  id: yup.string().required(),
  teams: yup.array().of(teamSchema).min(2).required(),
  relations: yup.object(),
});
