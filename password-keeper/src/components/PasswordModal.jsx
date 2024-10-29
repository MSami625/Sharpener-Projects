import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PasswordContext } from '../PasswordContext';

const PasswordModal = ({ closeModal }) => {
  const { addPassword, updatePassword, modalData, setModalData } = useContext(PasswordContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (modalData) {
      setName(modalData.name);
      setPassword(modalData.password);
    }
  }, [modalData]);

  const handleSubmit = () => {
    if (modalData) {
      updatePassword({ id: modalData.id, name, password });
    } else {
      addPassword({ name, password });
    }
    setModalData(null); // reset modalData
    closeModal();
  };

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <h2>{modalData ? 'Edit Password' : 'Add New Password'}</h2>
        <input
          type="text"
          placeholder="Platform Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>{modalData ? 'Update' : 'Add'}</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default PasswordModal;
