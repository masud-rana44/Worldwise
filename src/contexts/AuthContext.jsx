import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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

  async function signup(email, password, username) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(auth.currentUser, { displayName: username });
    const user = auth.currentUser;
    dispatch({ type: "user/updated", payload: user });
  }

  function login(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    const auth = getAuth();
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
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
