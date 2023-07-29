// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import Button from "./Button";
import styles from "../styles/Form.module.css";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const { addCity } = useCities();
  const [lat, lng] = useUrlPosition();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Called");
    if (!cityName || !country || !date) return;

    const newCity = {
      cityName,
      country,
      date: date.toISOString(),
      notes,
      position: {
        lat,
        lng,
      },
      emoji: "🇪🇸",
      id: Date.now().toString().slice(-8),
    };

    addCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
