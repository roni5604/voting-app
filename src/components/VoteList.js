import React from "react";

const VoteList = ({ votes, closeVote, castVote, userVotes, isAdmin }) => {
 return (
   <div>
     {votes.map((vote, idx) => (
       <div key={idx} style={{ border: "1px solid black", margin: "10px" }}>
         <h3>{vote.question}</h3>
         <p>Closing Date: {new Date(vote.closingDate * 1000).toString()}</p>
         <p>Status: {vote.isOpen ? "Open" : "Closed"}</p>
         <p>Options:</p>
         <ul>
           {vote.options.map((opt, index) => (
             <li key={index}>
               {opt} - Votes: {vote.votesPerOption[index].toString()}
               {!isAdmin && vote.isOpen && !userVotes[vote.id] && (
                 <button onClick={() => castVote(vote.id, index)}>Vote</button>
               )}
             </li>
           ))}
         </ul>
         {isAdmin && vote.isOpen && (
           <button onClick={() => closeVote(vote.id)}>Close Vote</button>
         )}
       </div>
     ))}
   </div>
 );
};

export default VoteList;

