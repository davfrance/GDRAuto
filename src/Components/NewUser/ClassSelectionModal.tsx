import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Keep carousel styles
import { IClasses, classes } from '../../Constants/classes';
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
  if (!open) return null; // Render nothing if not open

  function renderClasses() {
    const classesKeys = Object.keys(classes) as Array<keyof IClasses>;

    return (
      <Carousel
        className="h-full w-full rounded-lg overflow-hidden" // Ensure carousel fits container
        loop
        placeholder="" // Add placeholder
        {...({} as any)} // Add cast
        prevArrow={({ handlePrev }) => (
          <IconButton
            {...({} as any)} // Add cast
            placeholder=""
            variant="text"
            color="white" // Use theme-appropriate color
            size="lg"
            onClick={handlePrev}
            className="!absolute top-2/4 left-4 -translate-y-2/4 z-10"
          >
            {/* SVG Arrow Left */}
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            {...({} as any)} // Add cast
            placeholder=""
            variant="text"
            color="white" // Use theme-appropriate color
            size="lg"
            onClick={handleNext}
            className="!absolute top-2/4 !right-4 -translate-y-2/4 z-10"
          >
            {/* SVG Arrow Right */}
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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </IconButton>
        )}
      >
        {classesKeys.map((className, index) => (
          // Style individual carousel slide
          <div className="relative h-full w-full" key={index}>
            {/* Image with overlay */}
            <img
              className="h-full w-full object-cover" // Use object-cover
              src={classes[className].imageUrl}
              alt={classes[className].renderName}
            />
            {/* Overlay for text contrast */}
            <div className="absolute inset-0 grid h-full w-full place-items-end bg-black/40 ">
              <div className="w-full p-6 md:p-8 text-white mb-4">
                <div className="!text-2xl md:!text-3xl !mb-2">
                  <SubTitle>{classes[className].renderName}</SubTitle>
                </div>
                {/* Class Stats */}
                <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div>
                    HP:{' '}
                    <span className="font-semibold">
                      {classes[className].stats.hp}
                    </span>
                  </div>
                  <div>
                    Mana:{' '}
                    <span className="font-semibold">
                      {classes[className].stats.mana}
                    </span>
                  </div>
                  <div>
                    Attack:{' '}
                    <span className="font-semibold">
                      {classes[className].stats.attack}
                    </span>
                  </div>
                  <div>
                    Magic:{' '}
                    <span className="font-semibold">
                      {classes[className].stats.magic}
                    </span>
                  </div>
                  <div>
                    Stamina:{' '}
                    <span className="font-semibold">
                      {classes[className].stats.stamina}
                    </span>
                  </div>
                </div>
                {/* Select Button */}
                <Button
                  {...({} as any)} // Add cast
                  placeholder=""
                  size="lg"
                  color="blue-gray" // Example color
                  onClick={() => handleClassSelection(className)}
                  className="mt-4"
                  fullWidth
                >
                  Select {classes[className].renderName}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    );
  }

  return (
    // Replace Modal with fixed overlay and styled content container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-xl max-h-[100vh] lg:max-h-[90vh] aspect-verticalMobile flex flex-col m-auto">
        <div className="flex justify-between items-center mb-4">
          <Title>Select Your Class</Title>
          {/* Close Button */}
          <Button
            {...({} as any)} // Add cast
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
        {/* Carousel container takes remaining height */}
        <div className="flex-grow relative">{renderClasses()}</div>
      </div>
    </div>
  );
}

export default ClassSelectionModal;
