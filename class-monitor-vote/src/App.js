import React, { useContext } from "react";
import { VoteContext } from "./store";
import VotingForm from "./components/VotingForm";
import Results from "./components/Results";
import './App.css'; 

const App = () => {

  const { candidates } = useContext(VoteContext);


  const totalVotes = candidates.reduce((total, candidate) => total + candidate.votes, 0);

  return (
    <div className="app-container">
      <h1>Class Monitor Voting</h1>
      <h3>Total Votes: {totalVotes}</h3>
      <VotingForm />
      <Results />
    </div>
  );
};

export default App;
