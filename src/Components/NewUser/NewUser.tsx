import { Button, Input } from '@material-tailwind/react';
import { FormikProps, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { IGame, IStats, IUser } from '../../Types/Game';
import { uuidv4 } from '../../Utils';
import { Modal } from '@mui/material';
import ClassSelectionModal from './ClassSelectionModal';
import { IClasses, classes } from '../../Constants/classes';

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
      name: '',
      gender: '',
      class: undefined,
      image: '',
      hp: 20,
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
    onSubmit: (values, { resetForm }) => {
      formik.setFieldValue(position, values);
      onClose();
      resetForm();
      formikNewUser.setFieldValue('id', uuidv4());
    },
  });
  const { handleChange, values, handleSubmit } = formikNewUser;
  useEffect(() => {
    console.log('user', position, values);
  }, [values]);

  const generateStats = () => {
    const stats: IStats = {
      mana: Math.floor(Math.random() * 7) + 4,
      attack: Math.floor(Math.random() * 7) + 4,
      magic: Math.floor(Math.random() * 7) + 4,
      stamina: Math.floor(Math.random() * 7) + 4,
    };

    const keys = Object.keys(stats);
    const maxStat = keys.reduce(
      (max, key) =>
        stats[key as keyof IStats] > max ? stats[key as keyof IStats] : max,
      0
    );
    if (maxStat < 10) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      stats[randomKey as keyof IStats] = 10;
    }

    // Add class stats to the generated stats
    if (values.class) {
      stats.mana += values.class.stats.mana;
      stats.attack += values.class.stats.attack;
      stats.magic += values.class.stats.magic;
      stats.stamina += values.class.stats.stamina;
    }

    formikNewUser.setFieldValue('stats', stats);
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
          <Button type="submit">Save</Button>
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
