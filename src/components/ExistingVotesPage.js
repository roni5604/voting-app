import React from "react";
import AdminToolbar from "./AdminToolbar";

const ExistingVotesPage = ({ contract, onLogout }) => {
  return (
    <div>
      <AdminToolbar onLogout={onLogout} />
      <h1>Existing Votes</h1>
      {/* Display existing votes or vote management functionality here */}
    </div>
  );
};

export default ExistingVotesPage;
