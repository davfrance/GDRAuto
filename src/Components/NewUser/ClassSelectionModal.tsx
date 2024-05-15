// import { Modal, Button } from '@mui/material';
// import { IClasses, classes } from '../../Constants/classes'; // Import the classes from the constants file

// interface ClassSelectionModalProps {
//   open: boolean;
//   onClose: () => void;
//   handleClassSelection: (className: keyof IClasses) => void;
// }

// function ClassSelectionModal({
//   open,
//   onClose,
//   handleClassSelection,
// }: ClassSelectionModalProps) {
//   function renderClasses() {
//     let classesKeys = Object.keys(classes) as Array<keyof IClasses>;

//     return classesKeys.map((className, index) => (
//       <Button key={index} onClick={() => handleClassSelection(className)}>
//         {classes[className].renderName}
//       </Button>
//     ));
//   }

//   return (
//     <Modal open={open} className=" " onClose={onClose}>
//       <div className="flex flex-col gap-4 w-1/3 h-fit p-20 m-auto bg-myWhite rounded-lg">
//         <h2>Select Your Class</h2>
//         {renderClasses()}
//       </div>
//     </Modal>
//   );
// }

// export default ClassSelectionModal;
import { Modal } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { IClasses, classes } from '../../Constants/classes'; // Import the classes from the constants file
import SubTitle from '../Titles/SubTitle';
import { Carousel, Button, IconButton } from '@material-tailwind/react';
import Title from '../Titles/Title';

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

    return (
      <Carousel
        className="h-full w-full"
        loop
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            size="lg"
            onClick={handlePrev}
            className="!absolute top-2/4 left-4 -translate-y-2/4 text-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            size="lg"
            onClick={handleNext}
            className="!absolute top-2/4 !right-4 -translate-y-2/4 text-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </IconButton>
        )}
      >
        {classesKeys.map((className, index) => (
          <div className="w-full h-full " key={index}>
            <div className="relative h-full desktop:aspect-verticalMobile laptop:min-w-700px m-auto rounded-lg">
              <div className="relative bg-blend-darken w-full h-full rounded-lg">
                <img
                  className="absolute h-full w-auto rounded-lg"
                  src={classes[className].imageUrl} // Assuming you have an imageUrl in your classes object
                  alt={classes[className].renderName}
                />
                <div className="absolute opacity-75 rounded-lg bg-gradient-to-b from-transparent	 via-black/50 to-black/75 h-full w-full" />
              </div>
              <div className="absolute bottom-10 left-4 p-2">
                <div className=" text-primary flex flex-col items-start">
                  <SubTitle>{classes[className].renderName}</SubTitle>

                  <div>Mana: {classes[className].stats.mana}</div>
                  <div>Attack: {classes[className].stats.attack}</div>
                  <div>Magic: {classes[className].stats.magic}</div>
                  <div>Stamina: {classes[className].stats.stamina}</div>
                </div>
                <Button onClick={() => handleClassSelection(className)}>
                  Select
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    );
  }

  return (
    <Modal
      open={open}
      className="flex justify-center items-center "
      onClose={onClose}
    >
      <div className="flex flex-col gap-4 justify-center items-center desktop:w-1/3 desktop:h-[90vh] laptop:h-full laptop:w-full p-8 m-auto bg-myWhite rounded-lg ">
        <Title contrast>Select Your Class</Title>
        {renderClasses()}
      </div>
    </Modal>
  );
}

export default ClassSelectionModal;
