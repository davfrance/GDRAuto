import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { IGame } from '../../Types/Game';
import { Button } from '@material-tailwind/react';
import Title from '../../Components/Titles/Title';
import SubTitle from '../../Components/Titles/SubTitle';
import NewUser from '../../Components/NewUser/NewUser';
import { DEFAULT_AVATAR } from '../../Constants';
import NewTeam from '../../Components/NewTeam/NewTeam';
import { useDispatch } from 'react-redux';
import { saveGame } from '../../Redux/Slices/Game';
import { useNavigate } from 'react-router-dom';
import { gameCreationSchema } from '../../Validation/GameCreationSchema';
import { generateRelationsMap, uuidv4 } from '../../Utils';

function NewGame() {
  const [openNewUser, setOpenNewUser] = useState<number>(NaN);
  const [openNewTeam, setOpenNewTeam] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik<IGame>({
    validationSchema: gameCreationSchema,
    initialValues: { teams: [], id: uuidv4(), relations: generateRelationsMap() },
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: values => {
      dispatch(saveGame(values));
      navigate('/game');
    },
  });
  const { values, handleChange, isValid, errors } = formik;

  useEffect(() => {
    console.log(values);
  }, [values]);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors, values]);

  return (
    <div className="w-full h-full ">
      <Title>You are now creating a new game! Good luck explorer!</Title>
      <SubTitle>Parties</SubTitle>
      <div className="w-full h-full grid grid-cols-3 gap-8 flex-wrap justify-center">
        {values.teams.map((team, i) => {
          return (
            <div
              className=" h-fit p-8 border-solid rounded-lg bg-secondary"
              key={team.id}
            >
              <Title>{team.name}</Title>
              <SubTitle>Team members</SubTitle>
              <div className="flex flex-row flex-wrap gap-8 h-40 overflow-y-auto">
                {team.members.map(member => (
                  <div
                    className=" p-4 rounded-md flex flex-col justify-center items-center"
                    key={member.id}
                  >
                    <img
                      src={
                        member.image ||
                        member.class?.iconImageUrl ||
                        DEFAULT_AVATAR
                      }
                      alt=""
                      className="w-16 aspect-square rounded-full"
                    />
                    <div className="w-fit flex flex-col  justify-center items-center gap-4">
                      <div>{member.name}</div>
                      <div>{member.gender}</div>
                    </div>
                  </div>
                ))}
              </div>
              {team.members.length < 2 ? (
                <Button
                  onClick={() => {
                    setOpenNewUser(i);
                  }}
                >
                  Add a member to the party
                </Button>
              ) : null}

              <NewUser
                formik={formik}
                position={`teams[${i}].members[${team.members.length}]`}
                open={openNewUser == i}
                onClose={() => setOpenNewUser(NaN)}
              ></NewUser>
            </div>
          );
        })}
      </div>
      <NewTeam
        formik={formik}
        position={`teams[${values.teams.length}]`}
        open={openNewTeam}
        onClose={() => setOpenNewTeam(false)}
      ></NewTeam>
      <div className="!absolute bottom-16 right-10 flex gap-8">
        {isValid ? (
          <Button type="submit">Add a new party to the game</Button>
        ) : null}
        <Button
          onClick={() => {
            setOpenNewTeam(true);
          }}
        >
          Add a new party to the game
        </Button>
      </div>
    </div>
  );
}

export default NewGame;
