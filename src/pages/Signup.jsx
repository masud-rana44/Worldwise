import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import SpinnerFullPage from "../components/SpinnerFullPage";
import styles from "../styles/Login.module.css";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, user } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      await signup(email, password, username);
    } catch (err) {
      console.error(err);
      setError(err.message || err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(
    function () {
      if (user) navigate("/app", { replace: true });
    },
    [user, navigate]
  );

  if (user || isLoading) return <SpinnerFullPage />;

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Signup</Button>
        </div>
      </form>
    </main>
  );
}
