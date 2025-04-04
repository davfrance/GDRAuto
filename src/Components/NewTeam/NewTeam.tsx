import { Button, Input } from '@material-tailwind/react';
import { FormikProps, useFormik } from 'formik';
import { IGame, ITeam } from '../../Types/Game';
import { uuidv4 } from '../../Utils/gameUtils';
import Title from '../Titles/Title';

export interface INewTeam {
  formik: FormikProps<IGame>;
  position: string;
  open: boolean;
  onClose: () => void;
}

function NewTeam({ formik, position, open, onClose }: INewTeam) {
  const formikNewTeam = useFormik<ITeam>({
    initialValues: {
      id: uuidv4(),
      name: '',
      members: [],
      prime: 0,
    },
    validateOnMount: true,
    validate: values => {
      const errors: { name?: string } = {};
      if (!values.name) {
        errors.name = 'Team name is required';
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      formik.setFieldValue(position, values);
      resetForm();
      onClose();
      formikNewTeam.setFieldValue('id', uuidv4());
    },
  });
  const { handleChange, values, handleSubmit, errors, touched, isValid } =
    formikNewTeam;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <Title>Create New Team</Title>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            {...({} as any)}
            placeholder=""
            label="Team Name"
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
          <Button
            {...({} as any)}
            placeholder=""
            type="submit"
            color="blue"
            disabled={!isValid}
            fullWidth
          >
            Save Team
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NewTeam;
