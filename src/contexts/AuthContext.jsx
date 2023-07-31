import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useReducer } from "react";
import "../firebase.js";

const AuthContext = createContext();

const initialState = {
  user: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "user/updated":
      return {
        ...state,
        user: action.payload,
      };
    case "login":
      return { ...state, user: action.payload };
    case "logout":
      return { ...state, user: null };
    default:
      throw new Error("Unknown action type!");
  }
}

function AuthProvider({ children }) {
  const [{ user }, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "user/updated", payload: user });
    });
    return unsubscribe;
  }, []);

  function login(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    const auth = getAuth();
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
