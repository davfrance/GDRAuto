import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { IGame, ITeam } from '../../Types/Game';
import { Button } from '@material-tailwind/react';
import Title from '../../Components/Titles/Title';
import SubTitle from '../../Components/Titles/SubTitle';
import NewUser from '../../Components/NewUser/NewUser';
import { DEFAULT_AVATAR } from '../../Constants';
import NewTeam from '../../Components/NewTeam/NewTeam';
import TeamDetails from '../../Components/TeamDetails/TeamDetails';
import { useDispatch } from 'react-redux';
import { saveGame } from '../../Redux/Slices/Game';
import { useNavigate } from 'react-router-dom';
import { gameCreationSchema } from '../../Validation/GameCreationSchema';
import {
  generateMissingTeams,
  generateRelationsMap,
  getUserPrimeNumber,
  uuidv4,
} from '../../Utils';

function NewGame() {
  const [openNewUser, setOpenNewUser] = useState<number>(NaN);
  const [openNewTeam, setOpenNewTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const [openTeamDetails, setOpenTeamDetails] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik<IGame>({
    validationSchema: gameCreationSchema,
    initialValues: {
      teams: [...generateMissingTeams(null)],
      id: uuidv4(),
      relations: {},
      history: [],
      turn: {
        turnNumber: 0,
        events: [],
      },
    },
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: () => {
      return;
    },
  });
  function submitForm(values: IGame) {
    const valuesOutput = { ...values };
    valuesOutput.teams = [...values.teams, ...generateMissingTeams(values)];
    dispatch(saveGame(valuesOutput));
    navigate('/game');
  }
  const { values, isValid, errors } = formik;
  console.error('errors', errors);
  console.log('values', values);
  useEffect(() => {
    formik.setFieldValue('prime', getUserPrimeNumber(formik.values.teams));
    formik.setFieldValue(
      'relations',
      generateRelationsMap(formik.values.teams)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.teams]);

  return (
    <div className="w-full h-full ">
      <Title>You are now creating a new game! Good luck explorer!</Title>
      <SubTitle>Parties</SubTitle>
      <div className="w-full h-full grid grid-cols-3 gap-8 flex-wrap justify-center">
        {values.teams.map((team, i) => {
          return (
            <div
              className=" h-fit p-8 border-solid rounded-lg bg-secondary cursor-pointer hover:shadow-lg transition-shadow"
              key={team.id}
              onClick={() => {
                setSelectedTeam(team);
                setOpenTeamDetails(true);
              }}
              aria-hidden="true"
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
      <TeamDetails
        team={selectedTeam}
        open={openTeamDetails}
        onClose={() => setOpenTeamDetails(false)}
      />
      <div className="!absolute bottom-16 right-10 flex gap-8">
        {isValid ? (
          <Button
            type="submit"
            onClick={() => {
              submitForm(values);
            }}
          >
            Start the game
          </Button>
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
