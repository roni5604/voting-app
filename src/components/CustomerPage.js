import React, { useState, useEffect } from "react";
import VoteList from "./VoteList";

const CustomerPage = ({ contract, account, username }) => {
 const [votes, setVotes] = useState([]);
 const [userVotes, setUserVotes] = useState({});

 useEffect(() => {
   loadVotes();
 }, []);

 const loadVotes = async () => {
   const voteCount = await contract.voteCount();
   let tempVotes = [];
   let tempUserVotes = {};
   for (let i = 0; i < voteCount; i++) {
     const vote = await contract.getVoteDetails(i);
     const hasVoted = await contract.hasUserVoted(i, account);
     tempVotes.push(vote);
     tempUserVotes[i] = hasVoted;
   }
   setVotes(tempVotes);
   setUserVotes(tempUserVotes);
 };

 const castVote = async (voteId, optionIndex) => {
   await contract.vote(voteId, optionIndex);
   loadVotes();
 };

 const logout = () => {
   window.location.reload();
 };

 return (
   <div>
     <h1>Welcome, {username}</h1>
     <button onClick={logout}>Logout</button>
     <h2>Available Votes</h2>
     <VoteList
       votes={votes}
       userVotes={userVotes}
       castVote={castVote}
       isAdmin={false}
     />
   </div>
 );
};

export default CustomerPage;
