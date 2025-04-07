import React from 'react';
import { Button } from '@material-tailwind/react';
import Title from '../Titles/Title';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function InfoModal({ open, onClose, title, children }: InfoModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col transition-transform duration-300 ease-in-out transform scale-95 opacity-0 animate-modal-enter"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
          <Title>{title}</Title>
          <Button
            {...({} as any)} // Cast for type errors
            placeholder=""
            variant="text"
            color="gray"
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1 -mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-grow overflow-y-auto pr-2">
          {children}
        </div>
      </div>

      {/* Add simple enter animation keyframes (optional, add to index.css or similar) */}
      <style>
        {`
          @keyframes modal-enter {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-modal-enter {
            animation: modal-enter 0.3s forwards;
          }
        `}
      </style>
    </div>
  );
}

export default InfoModal; 