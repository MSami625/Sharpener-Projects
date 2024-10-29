import React, { createContext, useState } from 'react';

export const PasswordContext = createContext();

export const PasswordProvider = ({ children }) => {
  const [passwords, setPasswords] = useState([
    { id: 1, name: 'Gmail', password: '1234' },
    { id: 2, name: 'Facebook', password: '5858' }
  ]);
  const [modalData, setModalData] = useState(null); 

  const addPassword = (newPassword) => {
    setPasswords([...passwords, { ...newPassword, id: Date.now() }]);
  };

  const updatePassword = (updatedPassword) => {
    setPasswords(passwords.map(p => (p.id === updatedPassword.id ? updatedPassword : p)));
  };

  const deletePassword = (id) => {
    setPasswords(passwords.filter(password => password.id !== id));
  };

  return (
    <PasswordContext.Provider value={{
      passwords, addPassword, updatePassword, deletePassword, modalData, setModalData
    }}>
      {children}
    </PasswordContext.Provider>
  );
};
