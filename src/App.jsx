import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import EcommerceStore from './components/EcommerceStore';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EcommerceStore userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}