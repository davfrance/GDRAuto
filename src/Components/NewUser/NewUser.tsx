import { Button, Input } from '@material-tailwind/react';
import { FormikProps, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { IGame, IUser } from '../../Types/Game';
import {
  addClassStats,
  getDefaultStats,
  getUserPrimeNumber,
  uuidv4,
} from '../../Utils';
import { Modal } from '@mui/material';
import ClassSelectionModal from './ClassSelectionModal';
import { IClasses, classes } from '../../Constants/classes';
import { memberSchema } from '../../Validation/GameCreationSchema';
import { DEFAULT_HP } from '../../Constants';

export interface INewUser {
  formik: FormikProps<IGame>;
  position: string;
  open: boolean;
  onClose: () => void;
}

function NewUser({ formik, position, open, onClose }: INewUser) {
  const [openClassSelection, setOpenClassSelection] = useState(false);

  const formikNewUser = useFormik<IUser>({
    initialValues: {
      id: uuidv4(),
      prime: NaN,
      name: '',
      gender: '',
      class: undefined,
      image: '',
      hp: 0,
      stats: {
        mana: 0,
        attack: 0,
        magic: 0,
        stamina: 0,
      },
      hunger: 10,
      weapon: {},
      thirst: 10,
    },
    validationSchema: memberSchema,
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      formik.setFieldValue(position, values);
      onClose();
      resetForm();
      formikNewUser.setFieldValue('id', uuidv4());
    },
  });
  const { handleChange, values, handleSubmit } = formikNewUser;

  useEffect(() => {
    formikNewUser.setFieldValue(
      'prime',
      getUserPrimeNumber(formik.values.teams)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.teams]);

  useEffect(() => {
    const newStats = {
      mana: values.stats.mana,
      attack: values.stats.attack,
      magic: values.stats.magic,
      stamina: values.stats.stamina,
    };
    console.log('newStats', newStats);
  }, [values.stats]);

  const generateStats = () => {
    const stats = getDefaultStats();
    const hp = DEFAULT_HP;
    // Add class stats to the generated stats
    if (values.class) {
      const { newStats, newHP } = addClassStats(stats, hp, values.class);
      formikNewUser.setFieldValue('stats', newStats);
      formikNewUser.setFieldValue('hp', newHP);
      formikNewUser.validateForm();
    }
  };

  const handleClassSelectionModal = (className: keyof IClasses) => {
    formikNewUser.setFieldValue('class', classes[className]);
    setOpenClassSelection(false);
  };

  return (
    <Modal open={open} className=" " onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex justify-center items-center"
      >
        <div className="flex flex-col gap-4 w-1/3 h-fit p-20 m-auto bg-myWhite rounded-lg">
          <Input
            label={'Name'}
            onChange={handleChange}
            name={`name`}
            value={values.name}
          ></Input>
          <Input
            label={'Image'}
            onChange={handleChange}
            name={`image`}
            value={values.image}
          ></Input>
          <Input
            label={'Gender'}
            onChange={handleChange}
            name={`gender`}
            value={values.gender}
          ></Input>
          {!values.class ? (
            <Button
              onClick={() => {
                setOpenClassSelection(true);
              }}
            >
              Choose a class!
            </Button>
          ) : values.stats.attack == 0 ? (
            <Button onClick={generateStats}>Now find out your stats!</Button>
          ) : (
            <div>
              <p>Class:{values.class.renderName}</p>
              <p>
                HP: {values.hp} ({values.class ? values.class.stats.hp : 0})
              </p>
              <p>
                Mana: {values.stats.mana} (
                {values.class ? values.class.stats.mana : 0})
              </p>
              <p>
                Attack: {values.stats.attack} (
                {values.class ? values.class.stats.attack : 0})
              </p>
              <p>
                Magic: {values.stats.magic} (
                {values.class ? values.class.stats.magic : 0})
              </p>
              <p>
                Stamina: {values.stats.stamina} (
                {values.class ? values.class.stats.stamina : 0})
              </p>
            </div>
          )}
          <Button
            disabled={!formikNewUser.isValid || values.stats.attack == 0}
            type="submit"
          >
            Save
          </Button>
        </div>
        <ClassSelectionModal
          open={openClassSelection}
          onClose={() => {
            setOpenClassSelection(false);
          }}
          handleClassSelection={handleClassSelectionModal}
        />
      </form>
    </Modal>
  );
}

export default NewUser;
