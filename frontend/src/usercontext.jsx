import { createContext, useContext, useState, useEffect } from "react";
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and API key from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedApiKey = localStorage.getItem("apiKey");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
    } else {
      localStorage.removeItem("apiKey");
    }
  }, [apiKey]);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const updateApiKey = (key) => {
    setApiKey(key);
  };

  const logout = () => {
    setUser(null);
    setApiKey(null);
    localStorage.removeItem("user");
    localStorage.removeItem("apiKey");
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      apiKey, 
      setApiKey: updateApiKey,
      logout,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;