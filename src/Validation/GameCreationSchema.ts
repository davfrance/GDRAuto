import * as yup from 'yup';
import { IGame, ITeam, IUser } from '../Types/Game';


let memberSchema: yup.ObjectSchema<IUser> =  yup.object({
	id: yup.string().required(),
	name: yup.string().required(),
	gender:  yup.string().required(),
	image:  yup.string().required(),
	health:  yup.number().required(),
	hunger:  yup.number().required(),
	weapon:  yup.object(),
	thirst:  yup.number()
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
