import React from "react";

const LoginPage = ({ connectWallet }) => {
 return (
   <div className="login-container">
     <h1>Welcome to the Company Voting System</h1>
     <button onClick={connectWallet}>Login with MetaMask</button>
   </div>
 );
};

export default LoginPage;

