import React from "react";
import { useNavigate } from "react-router-dom";

const AdminToolbar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <button onClick={() => navigate("/admin/home")}>Home Page</button>
      <button onClick={() => navigate("/admin/add-vote")}>Add Vote</button>
      <button onClick={() => navigate("/admin/existing-votes")}>Existing Votes</button>
      <button onClick={() => navigate("/admin/settings")}>Settings</button>
      <button onClick={onLogout}>Logout</button> {/* Call onLogout directly */}
    </nav>
  );
};

export default AdminToolbar;
