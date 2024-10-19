import React from "react";
import AdminToolbar from "./AdminToolbar";

const SettingsPage = ({ onLogout }) => {
  return (
    <div>
      <AdminToolbar onLogout={onLogout} />
      <h1>Settings</h1>
      <p>Settings options for the admin can be placed here.</p>
    </div>
  );
};

export default SettingsPage;
