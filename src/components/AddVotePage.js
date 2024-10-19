import React from "react";
import AdminToolbar from "./AdminToolbar";

const AddVotePage = ({ contract, onLogout }) => {
  return (
    <div>
      <AdminToolbar onLogout={onLogout} />
      <h1>Add Vote</h1>
      {/* Add vote creation form or functionality here */}
    </div>
  );
};

export default AddVotePage;
