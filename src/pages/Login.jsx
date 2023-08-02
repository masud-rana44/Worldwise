import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import styles from "../styles/Login.module.css";
import StatusMessage from "../components/StatusMessage ";

export default function Login() {
  const { login, userLoading, userError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    login(email, password);
  }

  return (
    <main className={styles.login}>
      <PageNav />

      {userError && <StatusMessage status="error" message={userError} />}

      <form className={styles.form} onSubmit={handleSubmit}>
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
          <Button type="primary">{userLoading ? "Loading..." : "Login"}</Button>
        </div>
      </form>
    </main>
  );
}
