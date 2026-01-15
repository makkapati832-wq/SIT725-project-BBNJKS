import { createContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    // Safety: Ensure 'id' exists even if backend only sends '_id'
    const userWithId = {
      ...userData,
      id: userData.id || userData._id
    };
    
    setUser(userWithId);
    localStorage.setItem("user", JSON.stringify(userWithId));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Only render children when loading is complete to prevent redirects */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;