import { getDatabase, get, orderByKey, query, ref } from "firebase/database";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

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
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, error, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      const db = getDatabase();
      const citiesRef = ref(db, "cities");
      const citiesQuery = query(citiesRef, orderByKey());

      try {
        // request firebase database
        const snapshot = await get(citiesQuery);

        if (snapshot.exists()) {
          dispatch({ type: "cities/loaded", payload: snapshot.val() });
        }
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching cities",
        });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      const db = getDatabase();
      const cityRef = ref(db, `cities/0`);
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
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city.",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city.",
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
