import { Button, Input } from '@material-tailwind/react';
import { FormikProps, useFormik } from 'formik';
import { useEffect } from 'react';
import { IGame, IUser } from '../../Types/Game';
import { uuidv4 } from '../../Utils';
import { Modal } from '@mui/material';

export interface INewUser {
  formik: FormikProps<IGame>;
  position: string;
  open: boolean;
  onClose: () => void;
}

function NewUser({ formik, position, open, onClose }: INewUser) {
  const formikNewUser = useFormik<IUser>({
    initialValues: {
      id: uuidv4(),
      name: '',
      gender: '',
      image: '',
      health: 100,
      hunger: 100,
      weapon: {},
      thirst: 100,
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

          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}

export default NewUser;
