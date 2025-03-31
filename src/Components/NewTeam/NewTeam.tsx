import { Button, Input } from '@material-tailwind/react';
import { FormikProps, useFormik } from 'formik';
import { useEffect } from 'react';
import { IGame, ITeam } from '../../Types/Game';
import { uuidv4 } from '../../Utils/gameUtils';
import { Modal } from '@mui/material';

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
    },
    onSubmit: (values, { resetForm }) => {
      formik.setFieldValue(position, values);
      resetForm();
      onClose();
      formikNewTeam.setFieldValue('id', uuidv4());
    },
  });
  const { handleChange, values, handleSubmit } = formikNewTeam;

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

          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}

export default NewTeam;
