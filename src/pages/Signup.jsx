import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import styles from "../styles/Login.module.css";
import StatusMessage from "../components/StatusMessage ";

export default function Signup() {
  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password) return;

    try {
      setIsLoading(true);
      setError("");

      await signup(email, password, username);
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />

      {error && <StatusMessage status="error" message={error} />}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <div>
          <Button type="primary" disabled={isLoading}>
            {isLoading ? "Loading..." : "Signup"}
          </Button>
        </div>
      </form>
    </main>
  );
}
