import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import styles from "../styles/CountryList.module.css";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Added your first country by clicking on a city on the map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.some((el) => el.country === city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, idx) => (
        <CountryItem key={idx} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
