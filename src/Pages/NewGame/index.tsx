import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { IGame, ITeam, IUser } from '../../Types/Game';
import { Button } from '@material-tailwind/react';
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
  uuidv4,
} from '../../Utils/gameUtils';
import _ from 'lodash';

function NewGame() {
  const [openNewUser, setOpenNewUser] = useState<number | null>(null);
  const [openNewTeam, setOpenNewTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik<IGame>({
    validationSchema: gameCreationSchema,
    initialValues: {
      // teams: [],
      teams: [...generateMissingTeams(null)],

      id: uuidv4(),
      relations: {},
      history: [],
      defeatedTeams: [],
      turn: {
        turnNumber: 0,
        events: [],
      },
    },
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: () => {
      submitForm(formik.values);
    },
  });

  function submitForm(values: IGame) {
    if (!isValid) return;
    const valuesOutput = { ...values };
    valuesOutput.teams = [...values.teams, ...generateMissingTeams(values)];
    valuesOutput.relations = generateRelationsMap(valuesOutput.teams);
    dispatch(
      saveGame({ ...valuesOutput, defeatedTeams: values.defeatedTeams || [] })
    );
    navigate('/game');
  }

  const { values, isValid, setFieldValue, dirty } = formik;

  useEffect(() => {
    setFieldValue('relations', generateRelationsMap(values.teams));
  }, [values.teams, setFieldValue]);

  useEffect(() => {
    console.log('Selected Team State:', selectedTeam);
  }, [selectedTeam]);

  const handleOpenNewUser = (teamIndex: number) => setOpenNewUser(teamIndex);
  const handleCloseNewUser = () => setOpenNewUser(null);
  const handleOpenNewTeam = () => setOpenNewTeam(true);
  const handleCloseNewTeam = () => setOpenNewTeam(false);
  const handleSelectTeam = (team: ITeam | null) => {
    console.log('Handling select team:', team);
    setSelectedTeam(team);
  };

  useEffect(() => {
    if (values.teams.length === 0 && !dirty) {
      const initialTeam: ITeam = {
        id: uuidv4(),
        name: 'My Team',
        members: [],
        prime: 0,
      };
      setFieldValue('teams', [initialTeam]);
    }
  }, [values.teams.length, setFieldValue, dirty]);

  return (
    <div className="flex flex-col p-4 md:p-6 bg-gray-900 text-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-myWhite">
          New Game Setup
        </h1>
        <Button
          {...({} as any)}
          placeholder=""
          color="green"
          onClick={() => submitForm(values)}
          disabled={
            !isValid ||
            values.teams.length === 0 ||
            values.teams.some(t => t.members.length === 0)
          }
        >
          Start Game
        </Button>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <div className="bg-gray-800 p-3 rounded-lg shadow flex-grow">
            <h3 className="text-lg font-semibold mb-3 text-center border-b border-gray-700 pb-2 text-gray-200">
              Teams ({values.teams.length})
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {values.teams.map((team, index) => (
                <div
                  key={team.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedTeam?.id === team.id
                      ? 'bg-blue-900 border border-blue-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleSelectTeam(team)}
                  aria-hidden="true"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-myWhite truncate">
                      {team.name || `Team ${index + 1}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {team.members.length} Member
                      {team.members.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {team.members.slice(0, 4).map(member => (
                      <img
                        key={member.id}
                        src={
                          member.image ||
                          member.class?.iconImageUrl ||
                          DEFAULT_AVATAR
                        }
                        alt={member.name}
                        className="w-10 h-10 rounded-full border border-gray-500"
                        title={member.name}
                      />
                    ))}
                    {team.members.length > 4 && (
                      <span className="text-xs text-gray-400 self-center">
                        +{team.members.length - 4} more
                      </span>
                    )}
                  </div>
                  {team.members.length < 2 && (
                    <Button
                      {...({} as any)}
                      placeholder=""
                      variant="outlined"
                      className="text-blue-300 border-blue-400 hover:bg-blue-900/50 hover:text-blue-200 mt-2 w-full text-center"
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenNewUser(index);
                      }}
                    >
                      + Add Member
                    </Button>
                  )}
                </div>
              ))}
              {values.teams.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No teams created yet.
                </p>
              )}
            </div>
          </div>
          <Button
            {...({} as any)}
            placeholder=""
            className="bg-indigo-600 hover:bg-indigo-700"
            fullWidth
            onClick={handleOpenNewTeam}
          >
            + Add New Team
          </Button>
        </div>

        <div className="w-full md:w-3/4 bg-gray-800 p-4 rounded-lg shadow">
          {selectedTeam ? (
            <TeamDetails
              team={selectedTeam}
              onClose={() => handleSelectTeam(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                Select a team from the list to view or edit details.
              </p>
            </div>
          )}
        </div>
      </div>

      {openNewUser !== null && (
        <NewUser
          formik={formik}
          position={`teams[${openNewUser}].members[${
            values.teams[openNewUser]?.members.length || 0
          }]`}
          open={openNewUser !== null}
          onClose={handleCloseNewUser}
        />
      )}

      <NewTeam
        formik={formik}
        position={`teams[${values.teams.length}]`}
        open={openNewTeam}
        onClose={handleCloseNewTeam}
      />
    </div>
  );
}

export default NewGame;
