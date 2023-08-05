import {
  getDatabase,
  get,
  set,
  remove,
  orderByKey,
  query,
  ref,
} from "firebase/database";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useAuth } from "./AuthContext";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  error: "",
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, error: "", isLoading: true };
    case "loadingFalse":
      return { ...state, isLoading: false };
    case "setError":
      return { ...state, error: "" };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, cities: [], isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, error, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { user } = useAuth();

  useEffect(() => {
    let isCancelled = false;
    async function fetchCities() {
      if (!user?.uid) {
        // If user.uid doesn't exist, skip the request
        return;
      }

      dispatch({ type: "loading" });
      dispatch({ type: "setError" });

      const db = getDatabase();
      const citiesRef = ref(db, "cities/" + user?.uid);
      const citiesQuery = query(citiesRef, orderByKey());

      try {
        const snapshot = await get(citiesQuery);

        if (!isCancelled) {
          dispatch({ type: "loadingFalse" });
          if (snapshot.exists()) {
            dispatch({
              type: "cities/loaded",
              payload: Object.values(snapshot.val()),
            });
          } else {
            dispatch({ type: "loadingFalse" });
          }
        }
      } catch (error) {
        if (!isCancelled) {
          dispatch({
            type: "rejected",
            payload: "There was an error fetching cities",
          });
        }
      }
    }

    fetchCities();

    // Set a timeout to cancel the request after a certain time (e.g., 10 seconds)
    const requestTimeout = setTimeout(() => {
      isCancelled = true;
      dispatch({ type: "rejected", payload: "Request timed out" });
    }, 20000); // 20 seconds

    // Clean up the timeout on component unmount or when user.uid changes
    return () => clearTimeout(requestTimeout);
  }, [user?.uid]);

  const getCity = useCallback(
    async function getCity(id) {
      if (id === `${currentCity.id}`) return;

      const db = getDatabase();
      const cityRef = ref(db, "cities/" + user?.uid + "/" + id);
      const cityQuery = query(cityRef, orderByKey());

      dispatch({ type: "loading" });

      try {
        const snapshot = await get(cityQuery);

        if (snapshot.exists()) {
          dispatch({ type: "city/loaded", payload: snapshot.val() });
        }
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching cities",
        });
      }
    },
    [currentCity.id, user?.uid]
  );

  async function createCity(newCity) {
    const db = getDatabase();
    const cityRef = ref(db, "cities/" + user?.uid + "/" + newCity.id);
    const cityQuery = query(cityRef);

    dispatch({ type: "loading" });

    try {
      await set(cityQuery, newCity);
      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city.",
      });
    }
  }

  async function deleteCity(id) {
    const db = getDatabase();
    const cityRef = ref(db, "cities/" + user?.uid + "/" + id);
    const cityQuery = query(cityRef);

    dispatch({ type: "loading" });

    try {
      await remove(cityQuery);
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
