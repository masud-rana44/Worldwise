import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/User.module.css";

function User() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleClick() {
    logout();
    navigate("/");
  }

  if (!user || !user.displayName) return null;

  const firstName = user.displayName.trim().split(" ")[0];

  return (
    <div className={styles.user}>
      {/* <img src={user.avatar} alt={user.name} /> */}
      <span>Welcome, {firstName}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
