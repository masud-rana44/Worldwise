import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import styles from "../styles/Login.module.css";
import StatusMessage from "../components/StatusMessage ";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);
      setError("");

      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />

      {error && <StatusMessage status="error" message={error} />}

      <form
        className={`${styles.form} ${isLoading ? styles.loading : ""}`}
        onSubmit={handleSubmit}
      >
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

        <p>
          Not an account? <Link to="/signup">signup</Link>
        </p>

        <div>
          <Button type="primary" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </main>
  );
}
