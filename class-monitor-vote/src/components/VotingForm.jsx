import React, { useContext } from "react";
import { VoteContext } from "../store";
import ReactDOM from "react-dom";
import "../App.css";

const VotingForm = () => {
  const { candidates, setCandidates, modalOpen, setModalOpen, studentName, setStudentName, selectedCandidate, setSelectedCandidate, handleVote } = useContext(VoteContext);

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const onSubmit = (e) => {
    e.preventDefault();
    handleVote();
    closeModal(); 
  };

  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <h2>Vote for Class Monitor</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            required
          >
            <option value="" disabled>Select Candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.name} value={candidate.name}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button type="submit">Vote</button>
        </form>
        <button className="close-modal" onClick={closeModal}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="voting-form-container">
      <button className="open-modal-btn" onClick={openModal}>Open Voting Modal</button>
      {modalOpen && ReactDOM.createPortal(modalContent, document.body)}
    </div>
  );
};

export default VotingForm;
