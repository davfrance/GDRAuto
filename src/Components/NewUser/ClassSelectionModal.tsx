import { Modal, Button } from '@mui/material';
import { IClasses, classes } from '../../Constants/classes'; // Import the classes from the constants file

interface ClassSelectionModalProps {
  open: boolean;
  onClose: () => void;
  handleClassSelection: (className: keyof IClasses) => void;
}

function ClassSelectionModal({
  open,
  onClose,
  handleClassSelection,
}: ClassSelectionModalProps) {
  function renderClasses() {
    let classesKeys = Object.keys(classes) as Array<keyof IClasses>;

    return classesKeys.map((className, index) => (
      <Button key={index} onClick={() => handleClassSelection(className)}>
        {classes[className].renderName}
      </Button>
    ));
  }

  return (
    <Modal open={open} className=" " onClose={onClose}>
      <div className="flex flex-col gap-4 w-1/3 h-fit p-20 m-auto bg-myWhite rounded-lg">
        <h2>Select Your Class</h2>
        {renderClasses()}
      </div>
    </Modal>
  );
}

export default ClassSelectionModal;
