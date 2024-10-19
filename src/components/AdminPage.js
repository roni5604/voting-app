import React, { useState, useEffect, useCallback } from "react";
import AdminToolbar from "./AdminToolbar";
import VoteList from "./VoteList";

const AdminPage = ({ contract, account, username, onLogout }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [votes, setVotes] = useState([]);
  const [isValid, setIsValid] = useState(false);

  const loadVotes = useCallback(async () => {
    try {
      const voteCount = await contract.voteCount();
      let tempVotes = [];
      for (let i = 0; i < voteCount; i++) {
        const vote = await contract.getVoteDetails(i);
        tempVotes.push(vote);
      }
      setVotes(tempVotes);
    } catch (error) {
      console.error("Error loading votes:", error);
    }
  }, [contract]);

  useEffect(() => {
    loadVotes();
  }, [loadVotes]);

  const validateForm = useCallback(() => {
    const isQuestionValid = question.trim().length > 0;
    const areOptionsValid = options.length >= 2 && options.every(opt => opt.trim().length > 0);
    const currentDateTime = new Date();
    const closingDateTime = new Date(closingDate);
    const isDateValid = closingDateTime > currentDateTime;

    setIsValid(isQuestionValid && areOptionsValid && isDateValid);
  }, [question, options, closingDate]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const addOption = () => {
    if (optionInput.trim() !== "") {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const createVote = async () => {
    if (!isValid) {
      alert("Please fill out all fields correctly before creating the vote.");
      return;
    }

    try {
      const closingTimestamp = Math.floor(new Date(closingDate).getTime() / 1000);
      await contract.createVote(question, options, closingTimestamp);
      setQuestion("");
      setOptions([]);
      setClosingDate("");
      loadVotes();
    } catch (error) {
      console.error("Error creating vote:", error);
    }
  };

  const closeVote = async (voteId) => {
    await contract.closeVote(voteId);
    loadVotes();
  };

  return (
    <div>
      {/* Integrate AdminToolbar and pass onLogout */}
      <AdminToolbar onLogout={onLogout} />

      <h1>Welcome, {username} (Manager)</h1>
      <p>Wallet Address: {account}</p>
      <p>Hello, {username}!</p>

      <h2>Create a New Vote</h2>
      <input
        type="text"
        placeholder="Vote Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <h3>Options</h3>
      <input
        type="text"
        placeholder="Add Option"
        value={optionInput}
        onChange={(e) => setOptionInput(e.target.value)}
      />
      <button onClick={addOption}>Add Option</button>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            {opt}
            <button onClick={() => deleteOption(idx)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Closing Date</h3>
      <input
        type="datetime-local"
        value={closingDate}
        onChange={(e) => setClosingDate(e.target.value)}
      />

      {/* Move the Create Vote button down a row */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={createVote}
          disabled={!isValid}
        >
          Create Vote
        </button>
      </div>

      <h2>Existing Votes</h2>
      <VoteList votes={votes} closeVote={closeVote} isAdmin={true} />
    </div>
  );
};

export default AdminPage;
