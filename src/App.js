import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import AddVotePage from "./components/AddVotePage";
import ExistingVotesPage from "./components/ExistingVotesPage";
import SettingsPage from "./components/SettingsPage";
import CustomerPage from "./components/CustomerPage";
import VotingSystem from "./components/VotingSystem.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const tmpProvider = new Web3Provider(window.ethereum);
          setProvider(tmpProvider);

          const tmpContract = new ethers.Contract(
            "0x5DBD4bad9A18bD2992909E0C6D916cb1Cd145B14",
            VotingSystem.abi,
            tmpProvider.getSigner()
          );
          setContract(tmpContract);

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });
        } catch (err) {
          console.error("User denied MetaMask connection", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
  
      const role = await contract.getUserRole(accounts[0]);
      console.log("User Role:", role);
  
      const user = await contract.authorizedUsers(accounts[0]);
      console.log("User Details:", user);
      setUsername(user.username);
  
      if (role._isBigNumber) {
        setUserRole(role.toNumber());
      } else {
        setUserRole(Number(role));
      }
    } catch (err) {
      if (err.code === -32603 || err.message.includes("User is not authorized")) {
        console.error("Account is not authorized in the smart contract. Please check account permissions.");
        alert("Your account is not authorized to access this application. Please use an authorized account.");
      } else {
        console.error("Error connecting wallet or fetching user role:", err);
      }
    }
    
  };

  const onLogout = () => {
    setAccount("");
    setUserRole(null);
    setUsername("");
    navigate("/"); // Navigate to the login page
    window.location.reload();
  };

  if (!account) {
    return <LoginPage connectWallet={connectWallet} />;
  }

  return (
    <Routes>
      {userRole === 1 ? (
        <>
          <Route
            path="/admin/home"
            element={
              <AdminPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/add-vote"
            element={<AddVotePage contract={contract} onLogout={onLogout} />}
          />
          <Route
            path="/admin/existing-votes"
            element={<ExistingVotesPage contract={contract} onLogout={onLogout} />}
          />
          <Route
            path="/admin/settings"
            element={<SettingsPage onLogout={onLogout} />}
          />
          <Route path="*" element={<Navigate to="/admin/home" />} />
        </>
      ) : userRole === 2 ? (
        <>
          <Route
            path="/customer/home"
            element={
              <CustomerPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route path="*" element={<Navigate to="/customer/home" />} />
        </>
      ) : (
        <Route path="*" element={<LoginPage connectWallet={connectWallet} />} />
      )}
    </Routes>
  );
}

export default App;
