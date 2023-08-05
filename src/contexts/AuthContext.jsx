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
  user: null,
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

  // Signup
  async function signup(email, password, username) {
    const auth = getAuth();

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, { displayName: username });
      const user = auth.currentUser;
      dispatch({ type: "user/updated", payload: user });
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  // Login
  async function login(email, password) {
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  // Logout
  async function logout() {
    const auth = getAuth();

    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        dispatch,
      }}
    >
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
