import React, { createContext, useState, useEffect } from "react";

const initialCandidates = [
  { name: "Suresh", votes: 0, voters: [] },
  { name: "Sourav", votes: 0, voters: [] },
  { name: "Deepank", votes: 0, voters: [] },
];

const VoteContext = createContext(null);

const VoteProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [modalOpen, setModalOpen] = useState(false); 
  const [studentName, setStudentName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");

  
  useEffect(() => {
    const storedCandidates = localStorage.getItem("candidates");
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  // Save candidates to localStorage on change
  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  const handleVote = () => {
    const updatedCandidates = candidates.map((candidate) => {
      if (candidate.name === selectedCandidate) {
        return {
          ...candidate,
          votes: candidate.votes + 1,
          voters: [...candidate.voters, studentName], 
        };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
    setStudentName("");
    setSelectedCandidate("");
    setModalOpen(false); 
  };

  return (
    <VoteContext.Provider value={{ candidates, setCandidates, modalOpen, setModalOpen, studentName, setStudentName, selectedCandidate, setSelectedCandidate, handleVote }}>
      {children}
    </VoteContext.Provider>
  );
};

export { VoteContext, VoteProvider };
