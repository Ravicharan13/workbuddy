// import { createContext, useContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUser({ username: storedUsername });
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/get-require-info");
      setUser({ ...response.data, isLogin: true });
    } catch (err) {
      setUser(null);
    }
  };

  fetchUser();
}, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


