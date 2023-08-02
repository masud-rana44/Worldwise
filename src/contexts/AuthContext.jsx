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
import SpinnerFullPage from "../components/SpinnerFullPage.jsx";

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: true,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "user/loading":
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    case "user/updated":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    case "user/rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "user/errorUpdated":
      return { ...state, error: "" };
    default:
      throw new Error("Unknown action type!");
  }
}

function AuthProvider({ children }) {
  const [{ user, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

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
    dispatch({ type: "user/loading" });

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, { displayName: username });
      const user = auth.currentUser;
      dispatch({ type: "user/updated", payload: user });
    } catch (err) {
      console.error(err);
      dispatch({ type: "user/rejected", payload: err.message });
    }
  }

  // Login
  async function login(email, password) {
    const auth = getAuth();
    dispatch({ type: "user/loading" });

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      dispatch({ type: "user/rejected", payload: err.message });
    }
  }

  // Logout
  async function logout() {
    const auth = getAuth();
    dispatch({ type: "user/loading" });
    try {
      return signOut(auth);
    } catch (err) {
      console.error(err);
      dispatch({ type: "user/rejected", payload: err.message });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading: isLoading,
        userError: error,
        signup,
        login,
        logout,
        dispatch,
      }}
    >
      {isLoading ? <SpinnerFullPage /> : children}
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
