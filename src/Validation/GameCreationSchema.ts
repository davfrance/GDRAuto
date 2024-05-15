import * as yup from 'yup';
import { IGame, IStats, ITeam } from '../Types/Game';

const statsSchema: yup.ObjectSchema<IStats> = yup.object({
  mana: yup.number().min(1).required(),
  attack: yup.number().min(1).required(),
  magic: yup.number().min(1).required(),
  stamina: yup.number().min(1).required(),
});
export const memberSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  gender: yup.string(),
  image: yup.string(),
  hp: yup.number().required(),
  hunger: yup.number().required(),
  weapon: yup.object(),
  thirst: yup.number().required(),
  stats: statsSchema,
});

let teamSchema: yup.ObjectSchema<ITeam> = yup.object({
  id: yup.string().required(),
  members: yup.array().of(memberSchema).min(2).required(),
  name: yup.string().required(),
});

export let gameCreationSchema: yup.ObjectSchema<IGame> = yup.object({
  id: yup.string().required(),
  teams: yup.array().of(teamSchema).min(2).required(),
});
