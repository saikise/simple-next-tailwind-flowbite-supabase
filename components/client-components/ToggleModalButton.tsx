"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface ToggleModalButtonProps {
  children: React.ReactNode;
  buttonName: string;
  modalTitle: string;
  modalID: string;
}

const ToggleModalButton: React.FC<ToggleModalButtonProps> = ({
  children,
  buttonName,
  modalTitle, 
  modalID,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleModal}
        className="block w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {buttonName}
      </button>
      <Modal
        isOpen={isOpen}
        onClose={toggleModal}
        title={modalTitle}
        id={modalID}
      >
        {children}
      </Modal>
    </>
  );
};

export default ToggleModalButton;
