import { Button, Input } from '@material-tailwind/react';
import { FormikProps, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { IGame, IUser } from '../../Types/Game';
import { addClassStats, getDefaultStats, uuidv4 } from '../../Utils/gameUtils';
import ClassSelectionModal from './ClassSelectionModal';
import { IClasses, classes } from '../../Constants/classes';
import { memberSchema } from '../../Validation/GameCreationSchema';
import { DEFAULT_HP, DEFAULT_AVATAR } from '../../Constants';
import Title from '../Titles/Title';

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
      hp: 0,
      stats: {
        mana: 0,
        attack: 0,
        magic: 0,
        stamina: 0,
      },
      hunger: 10,
      weapon: undefined,
      thirst: 10,
    },
    validationSchema: memberSchema,
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      if (values.stats.attack === 0 || values.hp === 0) {
        const stats = getDefaultStats();
        const hp = DEFAULT_HP;
        if (values.class) {
          const { newStats, newHP } = addClassStats(stats, hp, values.class);
          formik.setFieldValue(position, {
            ...values,
            stats: newStats,
            hp: newHP,
          });
        } else {
          formik.setFieldValue(position, { ...values, stats: stats, hp: hp });
        }
      } else {
        formik.setFieldValue(position, values);
      }
      onClose();
      resetForm();
      formikNewUser.setFieldValue('id', uuidv4());
    },
  });
  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    touched,
    isValid,
    setFieldValue,
  } = formikNewUser;

  useEffect(() => {
    if (values.class) {
      const stats = getDefaultStats();
      const hp = DEFAULT_HP;
      const { newStats, newHP } = addClassStats(stats, hp, values.class);
      setFieldValue('stats', newStats);
      setFieldValue('hp', newHP);
    } else {
      setFieldValue('stats', getDefaultStats());
      setFieldValue('hp', DEFAULT_HP);
    }
    formikNewUser.validateForm();
  }, [values.class, setFieldValue]);

  const handleClassSelectionModal = (className: keyof IClasses) => {
    setFieldValue('class', classes[className]);
    setOpenClassSelection(false);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 text-myWhite p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-1">
            <Title>Add New Member</Title>
            <Button
              {...({} as any)}
              placeholder=""
              variant="text"
              color="gray"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 -mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          <Input
            {...({} as any)}
            placeholder=""
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            color="blue"
            className=" text-myWhite"
            error={touched.name && !!errors.name}
          />
          {touched.name && errors.name && (
            <p className="text-red-500 text-xs -mt-3 ml-1">{errors.name}</p>
          )}

          <Input
            {...({} as any)}
            placeholder=""
            label="Image URL (Optional)"
            name="image"
            value={values.image}
            onChange={handleChange}
            color="blue"
            className=" text-myWhite"
            error={touched.image && !!errors.image}
          />

          <Input
            {...({} as any)}
            placeholder=""
            label="Gender"
            name="gender"
            value={values.gender}
            onChange={handleChange}
            color="blue"
            className=" text-myWhite"
            error={touched.gender && !!errors.gender}
          />
          {touched.gender && errors.gender && (
            <p className="text-red-500 text-xs -mt-3 ml-1">{errors.gender}</p>
          )}

          <div className="bg-gray-700 p-4 rounded-md">
            {!values.class ? (
              <Button
                {...({} as any)}
                placeholder=""
                onClick={() => setOpenClassSelection(true)}
                color="teal"
                fullWidth
              >
                Choose a Class
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={values.class.iconImageUrl || DEFAULT_AVATAR}
                    alt={values.class.renderName}
                    className="w-12 h-12 rounded-md border border-gray-500"
                  />
                  <div>
                    <p className="font-semibold text-lg">
                      {values.class.renderName}
                    </p>
                    <p className="text-xs text-gray-400">
                      HP: {values.hp} | Mana: {values.stats.mana} | Atk:{' '}
                      {values.stats.attack} | Mgc: {values.stats.magic} | Stm:{' '}
                      {values.stats.stamina}
                    </p>
                  </div>
                </div>
                <Button
                  {...({} as any)}
                  placeholder=""
                  onClick={() => setOpenClassSelection(true)}
                  variant="outlined"
                  size="sm"
                  className="border-gray-500 text-gray-300 hover:bg-gray-600"
                >
                  Change
                </Button>
              </div>
            )}
            {touched.class &&
              errors.class &&
              typeof errors.class === 'string' && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.class}</p>
              )}
          </div>

          <Button
            {...({} as any)}
            placeholder=""
            disabled={!isValid || !values.class}
            type="submit"
            color="blue"
            fullWidth
          >
            Save Member
          </Button>
        </form>

        <ClassSelectionModal
          open={openClassSelection}
          onClose={() => setOpenClassSelection(false)}
          handleClassSelection={handleClassSelectionModal}
        />
      </div>
    </>
  );
}

export default NewUser;
