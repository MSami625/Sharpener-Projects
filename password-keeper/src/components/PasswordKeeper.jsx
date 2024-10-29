import React, { useContext, useState } from 'react';
import { PasswordContext } from '../PasswordContext';
import PasswordModal from './PasswordModal';

const PasswordKeeper = () => {
  const { passwords, deletePassword, setModalData } = useContext(PasswordContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (password = null) => {
    setModalData(password); 
    setIsModalOpen(true);
  };




  return (
    <div>
      <h1>Password Keeper</h1>
      <button onClick={() => openModal()}>Add New Password</button>
      <div>
        {passwords.map(password => (
          <div key={password.id}>
            <span>{password.name}</span>
            <span>{password.password}</span>
            <button onClick={() => deletePassword(password.id)}>Delete</button>
            <button onClick={() => openModal(password)}>Edit</button>
          </div>
        ))}

        {passwords.length === 0 && <p>No passwords found.</p>}
      </div>
      {isModalOpen && <PasswordModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PasswordKeeper;
