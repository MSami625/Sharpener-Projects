import React, { useContext } from "react";
import { VoteContext } from "../store";
import '../App.css'; 

const Results = () => {
  const { candidates, setCandidates } = useContext(VoteContext);


  const deleteVote = (candidateName, voterName) => {
    const updatedCandidates = candidates.map((candidate) => {
      if (candidate.name === candidateName) {
        const filteredVoters = candidate.voters.filter(voter => voter !== voterName);
        return {
          ...candidate,
          votes: filteredVoters.length,
          voters: filteredVoters,
        };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
  };

  return (
    <div className="results-container">
      <h2>Voting Results</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.name}>
            <div>
              <span className="candidate-name">{candidate.name}</span>: 
              <span className="vote-count">{candidate.votes} votes</span>
            </div>
            <div>
              {candidate.voters.length > 0 ? (
                candidate.voters.map((voter, index) => (
                  <div key={index} className="voter-info">
                    <span>{voter}</span> 
                   <button
                      className="delete-btn"
                      onClick={() => deleteVote(candidate.name, voter)}
                    >
                      Delete Vote
                    </button>
                  </div>
                ))
              ) : (
                <span className="no-votes">No votes yet.</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
