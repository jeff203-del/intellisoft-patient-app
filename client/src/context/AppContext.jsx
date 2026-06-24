import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [lastBMI, setLastBMI] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const value = {
    currentPatient,
    setCurrentPatient,
    lastBMI,
    setLastBMI,
    notification,
    showNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-medium animate-fade-in
          ${notification.type === 'success' ? 'bg-emerald-500' : 
            notification.type === 'error' ? 'bg-rose-500' : 'bg-primary-500'}`}>
          {notification.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};